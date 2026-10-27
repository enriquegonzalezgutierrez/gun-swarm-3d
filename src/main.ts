import { UpgradeShopService } from './application/services/UpgradeShopService';
import type { SaveGameDTO } from './application/dtos/SaveGameDTO';
import { LoadProgressUseCase } from './application/use-cases/LoadProgressUseCase';
import { TickGameLoopUseCase } from './application/use-cases/TickGameLoopUseCase';
import { UpgradeAttributeUseCase } from './application/use-cases/UpgradeAttributeUseCase';
import { CannonPhysicsAdapter } from './infrastructure/physics/CannonPhysicsAdapter';
import { WebAudioAdapter } from './infrastructure/audio/WebAudioAdapter';
import { BrowserTouchInputAdapter } from './infrastructure/input/BrowserTouchInputAdapter';
import { CombinedInputAdapter } from './infrastructure/input/CombinedInputAdapter';
import { KeyboardInputAdapter } from './infrastructure/input/KeyboardInputAdapter';
import { LocalStorageAdapter } from './infrastructure/storage/LocalStorageAdapter';
import { PhaseCatalog } from './infrastructure/levels/PhaseCatalog';
import { ThreeJsRenderAdapter } from './infrastructure/rendering/ThreeJsRenderAdapter';
import { RunSessionFactory } from './infrastructure/RunSessionFactory';
import { UIOverlayController } from './infrastructure/ui/UIOverlayController';

async function bootstrap(): Promise<void> {
  const container = document.getElementById('game-container');
  if (container === null) {
    throw new Error('Missing #game-container element.');
  }

  const render = new ThreeJsRenderAdapter();
  render.initViewport(container);
  const canvas = container.querySelector('canvas');
  if (canvas === null) {
    throw new Error('Renderer did not create a canvas.');
  }

  const physics = new CannonPhysicsAdapter();
  const audio = new WebAudioAdapter();
  const storage = new LocalStorageAdapter();
  const input = new CombinedInputAdapter(
    new BrowserTouchInputAdapter(canvas),
    new KeyboardInputAdapter(window),
  );
  const view = new UIOverlayController(document);
  const loadProgress = new LoadProgressUseCase(storage);
  const upgradeAttribute = new UpgradeAttributeUseCase();
  const shopService = new UpgradeShopService();
  const sessionFactory = new RunSessionFactory(render, physics, input, view);

  let save: SaveGameDTO = await loadProgress.execute();
  let phaseNumber = save.progression.lastPlayedPhase;
  let session: ReturnType<RunSessionFactory['create']> | null = null;
  let gameLoop: TickGameLoopUseCase | null = null;

  const openShop = (): void => {
    view.showShop(shopService.list(save), save.currency.gold);
  };

  const startPhase = (nextPhase: number, autoStart: boolean): void => {
    session?.dispose();
    phaseNumber = nextPhase;
    const config = PhaseCatalog.get(nextPhase);
    render.setBiomeEnvironment(config.biomeId);
    render.setTrackLength(config.trackLength);
    view.setBossName(config.bossName);
    const nextSession = sessionFactory.create(
      config,
      save,
      (summary) => {
        save = {
          ...save,
          currency: { gold: save.currency.gold + summary.finalGold },
          progression: {
            highestUnlockedPhase: Math.max(
              save.progression.highestUnlockedPhase,
              summary.nextPhase ?? summary.phaseNumber,
            ),
            lastPlayedPhase: summary.nextPhase ?? summary.phaseNumber,
          },
        };
        void storage.save(save);
      },
      (stats) => {
        save = {
          ...save,
          currency: { gold: save.currency.gold + stats.goldCollected },
          progression: {
            ...save.progression,
            lastPlayedPhase: stats.phaseNumber,
          },
        };
        void storage.save(save);
      },
    );
    session = nextSession;
    gameLoop = new TickGameLoopUseCase([nextSession], physics, render);
    view.showStart();
    if (autoStart) {
      void audio.initContext();
      nextSession.start();
    }
  };

  view.onStart = (): void => {
    void audio.initContext();
    session?.start();
  };
  view.onRetry = (): void => startPhase(phaseNumber, true);
  view.onNextPhase = (): void => startPhase(phaseNumber < 5 ? phaseNumber + 1 : 1, true);
  view.onOpenShop = openShop;
  view.onUpgrade = (attribute): void => {
    try {
      save = upgradeAttribute.execute(save, attribute);
      void storage.save(save);
      openShop();
    } catch {
      /* Insufficient gold or maximum level: leave the shop unchanged. */
    }
  };
  view.onCloseShop = (): void => undefined;

  startPhase(phaseNumber, false);

  const frame = (timestamp: number): void => {
    gameLoop?.execute(timestamp);
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

void bootstrap();
