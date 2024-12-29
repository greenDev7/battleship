<template>
  <div class="container">
    <div class="position-fixed alpos">
      <div
        class="alert alert-dismissible fade show"
        :class="`alert-${getAlert.alertColor}`"
        role="alert"
        v-show="getAlert.alertVisible"
      >
        {{ getAlert.alertText }}
        <button
          type="button"
          class="btn-close"
          aria-label="Close"
          @click="hideAlert"
        ></button>
      </div>
    </div>
    <input
      ref="nickNameInput"
      class="form-control form-control-lg mb-4"
      placeholder="Введите ник"
      type="text"
      v-model="nickName"
      :disabled="nicknameDisabled"
    />
    <div
      v-if="this.captchaVisible"
      class="border border-secondary border-3 rounded-3 p-1 w-fit mx-auto mb-4"
    >
      <CaptchaComponent @captchaOkButtonClicked="processCaptcha" />
    </div>
    <div
      class="d-flex flex-row flex-wrap mb-4 justify-content-center justify-content-lg-between"
    >
      <div class="w-100 maxw-400 pb-3">
        <button
          class="btn btn-lg btn-dark p-3 w-100 text-nowrap"
          type="button"
          @click="handleRandomGameButtonClick"
          :disabled="topButtonDisabled"
        >
          Игра со случайным соперником
        </button>
      </div>
      <div class="w-100 maxw-400 pb-3">
        <button
          class="btn btn-lg btn-dark p-3 w-100 text-nowrap"
          type="button"
          :disabled="topButtonDisabled"
        >
          Игра с другом
        </button>
      </div>
      <div class="w-100 maxw-400 pb-3">
        <button
          class="btn btn-lg btn-dark p-3 w-100 text-nowrap"
          type="button"
          :disabled="topButtonDisabled"
        >
          Игра с компьютером
        </button>
      </div>
    </div>
    <EnemyInfoComponent
      id="enemy-component"
      v-if="infoComponentVisible"
      :enemyNickName="this.enemyNickName"
      :enemyState="this.enemyState"
    />
    <GameOverInfoComponent v-if="gameOverInfoIsVisible" :isWinner="isWinner" />

    <BattleBoardComponent
      :isMyTurnToShoot="this.myTurnToShoot"
      :turnOrderHintsVisible="this.turnOrderHintsVisible"
      :enemyShotHint="this.enemyShotHint"
      :enemyNickname="this.enemyNickName"
    />
    <div class="d-flex flex-row flex-wrap mt-4 mt-lg-4 justify-content-center">
      <div class="minw-17 mb-4 px-3">
        <button
          class="btn btn-lg btn-success w-100 text-nowrap"
          type="button"
          @click="handlePlayButtonClick"
          :disabled="playButtonDisabled"
        >
          Играть
        </button>
      </div>
      <div class="minw-17 px-3">
        <button
          class="btn btn-lg btn-danger w-100 text-nowrap"
          type="button"
          :disabled="endGameButtonDisabled"
          @click="handleFinishButtonClick"
        >
          Завершить игру
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import BattleBoardComponent from "../components/BattleBoardComponent.vue";
import GameOverInfoComponent from "../components/GameOverInfoComponent.vue";
import CaptchaComponent from "../components/CaptchaComponent.vue";
import { defineComponent } from "vue";
import ActionStore from "@/store/index";
import MessageType from "@/model/enums/MessageType";
import EnemyInfoComponent from "@/components/EnemyInfoComponent.vue";
import { v4 as uuidv4 } from "uuid";
import {
  WSDataTransferRootType,
  FireResponseType,
  UnSunkShipsType,
} from "@/model/WSDataTransferRoot";
import { mapGetters } from "vuex";
import EnemyState from "@/model/enums/EnemyState";
import GameStore from "@/store/index";
import Location from "@/model/Location";
import Game from "@/model/Game";
import HighlightType from "@/model/enums/HighlightType";
import ShotResult from "@/model/enums/ShotResult";
import Ship from "@/model/Ship";
import { serverHost, serverPort } from "@/helpers/axios";

export default defineComponent({
  name: "BattleShipView",

  components: {
    BattleBoardComponent,
    EnemyInfoComponent,
    GameOverInfoComponent,
    CaptchaComponent,
  },

  data() {
    return {
      nickName: "",
      enemyNickName: "",
      enemyState: EnemyState.WAITING_FOR_ENEMY,
      topButtonDisabled: true,
      nicknameDisabled: false,
      infoComponentVisible: false,
      playButtonDisabled: true,
      endGameButtonDisabled: true,
      myTurnToShoot: false,
      turnOrderHintsVisible: false,
      ctx_: CanvasRenderingContext2D,
      hostileCtx_: CanvasRenderingContext2D,
      enemyShotHint: "",
      currentShot: new Location(0, 0),
      gameOverInfoIsVisible: false,
      isWinner: false,
      isPlaying: false,
      captchaVisible: true,
    };
  },

  computed: {
    ...mapGetters([
      "getWebSocket",
      "getClientUuid",
      "getEnemyClientUuid",
      "getContext2D",
      "getHostileContext2D",
      "getAlert",
    ]),
  },

  methods: {
    getContext(): CanvasRenderingContext2D {
      return this.ctx_ as unknown as CanvasRenderingContext2D;
    },

    processCaptcha(isCaptchaSuccess: boolean) {
      this.topButtonDisabled = !isCaptchaSuccess;
      this.captchaVisible = !isCaptchaSuccess;

      if (!isCaptchaSuccess) this.showAlert("Неверный код", "danger");
    },

    preventNavAndUnload(event: BeforeUnloadEvent) {
      if (!this.isPlaying) return;
      event.preventDefault();
      event.returnValue = "";
    },

    hideAlert() {
      GameStore.commit("hideAlert");
    },

    handleRandomGameButtonClick(event: PointerEvent) {
      if (this.nickName.trim().length === 0) {
        this.showAlert("Для игры необходимо ввести ник!", "warning");
        return;
      }

      const userRequestBody = {
        msg_type: MessageType.RANDOM_GAME,
        nickName: this.nickName.trim(),
      };

      let clientUUID = uuidv4();

      let ws: WebSocket = new WebSocket(
        `ws://${serverHost}:${serverPort}/client/${clientUUID}/ws`
      );

      this.setupSocketConnectionAndCreateRivalCouple(
        ws,
        userRequestBody,
        clientUUID
      );

      this.isPlaying = true;
      this.topButtonDisabled = true;
      this.nicknameDisabled = true;
      this.infoComponentVisible = true;
    },

    setupSocketConnectionAndCreateRivalCouple(
      ws: WebSocket,
      userRequestBody: Object,
      clientUuid: string
    ) {
      ws.onopen = function (event) {
        console.log("Successfully connected to the websocket server...");
        ActionStore.dispatch("createTeamPlayerWS", {
          ws,
          userRequestBody,
          clientUuid,
        });
      };

      const processData = this.processDataFromServer;
      ws.onmessage = function (event: MessageEvent<string>) {
        processData(event.data);
      };

      ws.onerror = function (event: Event) {
        console.log("Connection error");
      };

      ws.onclose = function (event: CloseEvent) {
        if (event.wasClean) {
          console.log("Connection closed correctly");
        } else {
          console.error("The connection was broken");
        }
      };
    },

    showAlert(alertText: string, alertColor: string = "danger") {
      GameStore.commit("setAlert", { alertText, alertColor });
    },

    disableShooting() {
      (
        this.hostileCtx_ as unknown as CanvasRenderingContext2D
      ).canvas.removeEventListener("click", this.handleHostileGridClick);

      this.myTurnToShoot = false;
    },

    enableShooting() {
      (
        this.hostileCtx_ as unknown as CanvasRenderingContext2D
      ).canvas.addEventListener("click", this.handleHostileGridClick);

      this.myTurnToShoot = true;
    },

    processDataFromServer(dataFromServer: string) {
      let parsedData: WSDataTransferRootType = JSON.parse(dataFromServer);

      switch (parsedData.msg_type) {
        case MessageType.RANDOM_GAME:
          if (parsedData.is_status_ok) {
            if (parsedData.data.enemy_nickname) {
              console.log("Enemy for random game successfully created");
              this.enemyNickName = parsedData.data.enemy_nickname;
              this.enemyState = EnemyState.SHIPS_POSITIONING;
              this.playButtonDisabled = false;
            }
          } else {
            this.showAlert("Возникла ошибка при поиске случайного соперника");
            console.log("Random enemy search error: ", parsedData.data);
          }

          break;

        case MessageType.DISCONNECTION:
          if (parsedData.is_status_ok)
            this.showAlert(
              "К сожалению, ваш соперник разорвал соединение и вышел из игры. Обновите страницу для новой игры"
            );
          break;

        case MessageType.SHIPS_ARE_ARRANGED:
          if (parsedData.is_status_ok) {
            this.enemyState = EnemyState.READY_TO_PLAY;
            ActionStore.commit(
              "setEnemyClientUuid",
              parsedData.data.enemy_client_id
            );
          }
          break;

        case MessageType.PLAY:
          if (parsedData.is_status_ok) {
            this.enemyState = EnemyState.PLAYING;
            this.myTurnToShoot = parsedData.data.turn_to_shoot;
            this.turnOrderHintsVisible = true;

            if (this.myTurnToShoot) this.enableShooting();
          }
          break;

        // действия на своем гриде
        case MessageType.FIRE_REQUEST:
          if (parsedData.is_status_ok) {
            let shot: Location = new Location(
              parsedData.data.shot_location._x,
              parsedData.data.shot_location._y
            );

            let ht: HighlightType = HighlightType.CIRCLE;
            let ship: Ship | undefined = Game.getShipByLocation(shot);

            let ctx = this.getContext();

            let fireResponse: FireResponseType = {
              msg_type: MessageType.FIRE_RESPONSE,
              shot_result: ShotResult.MISS,
              enemy_client_id: this.getEnemyClientUuid,
              edgeLocs: [],
              gameIsOver: false,
            };

            if (ship) {
              ht = HighlightType.CROSS;
              Game.highlightDiagonalsAndPushToHistory(ctx, shot);
              ship.hitsNumber++;

              if (ship.hitsNumber < ship.length) {
                fireResponse.shot_result = ShotResult.HIT;
              } else {
                fireResponse.shot_result = ShotResult.SUNK;
                // Отмечаем кружочком торцевые локации корабля
                let edgeLocs = ship.getFrontAndBackLocations();
                for (const loc of edgeLocs) {
                  loc.highlight(ctx);
                  fireResponse.edgeLocs.push({ _x: loc.x, _y: loc.y });
                }

                // Если все корабли потоплены, даем знать об этом противнику. Игра окончена!
                if (Game.allShipsAreSunk()) {
                  this.infoComponentVisible = false;
                  fireResponse.gameIsOver = true;
                  this.gameOverInfoIsVisible = true;
                  this.turnOrderHintsVisible = false;
                }
              }

              this.disableShooting();
            } else this.enableShooting();

            shot.highlight(ctx, ht);

            // Отправляем сопернику информацию о попадании (мимо/ранил/потоплен)
            // с типом сообщения FIRE_RESPONSE

            const ws: WebSocket = this.getWebSocket;
            ws.send(JSON.stringify(fireResponse));

            this.enemyShotHint = shot.toString();
          }
          break;

        // действия на гриде соперника
        case MessageType.FIRE_RESPONSE:
          if (parsedData.is_status_ok) {
            let hostileCtx = this
              .hostileCtx_ as unknown as CanvasRenderingContext2D;

            Game.shotHistory.push(this.currentShot as Location);

            if (parsedData.data.shot_result === ShotResult.MISS) {
              // Если промахнулись
              this.currentShot.highlight(hostileCtx);
              this.enemyShotHint = "";
              this.disableShooting();
            } else {
              // иначе
              this.currentShot.highlight(hostileCtx, HighlightType.CROSS);
              Game.highlightDiagonalsAndPushToHistory(
                hostileCtx,
                this.currentShot as Location,
                true
              );
              // если от соперника пришла информация, что корабль потоплен
              if (parsedData.data.shot_result === ShotResult.SUNK) {
                for (const el of parsedData.data.edgeLocs) {
                  let loc = new Location(el._x, el._y);
                  if (!Game.containsLocation(loc, Game.shotHistory))
                    Game.shotHistory.push(loc);
                  loc.highlight(hostileCtx);
                }

                // если от соперника пришел ответ, что все корабли потоплены
                if (parsedData.data.gameIsOver) {
                  this.infoComponentVisible = false;
                  this.gameOverInfoIsVisible = true;
                  this.disableShooting();
                  this.turnOrderHintsVisible = false;
                  this.isWinner = true;
                  // Отправим сопернику информацию о непотопленных кораблях
                  this.sendUnsunkShipsToEnemy();
                }
              }
            }
          }
          break;

        case MessageType.UNSUNK_SHIPS:
          if (parsedData.is_status_ok) {
            console.log("receive unsunk ships: ", parsedData.data.unSunkShips);

            let unsunkShips: Ship[] = parsedData.data.unSunkShips.map(
              (s) =>
                new Ship(s.length, s.type, new Location(s.loc._x, s.loc._y))
            );

            // Покажем где у соперника остались непотопленные корабли
            let hostileCtx_ = this
              .hostileCtx_ as unknown as CanvasRenderingContext2D;
            unsunkShips.forEach((ship) => ship.draw(hostileCtx_, "red"));
          }
          break;

        default:
          break;
      }
    },

    sendUnsunkShipsToEnemy(): void {
      const ws: WebSocket = this.getWebSocket;

      let unsunkShipsResp: UnSunkShipsType = {
        msg_type: MessageType.UNSUNK_SHIPS,
        enemy_client_id: this.getEnemyClientUuid,
        unSunkShips: [],
      };

      let unSunkShips: Ship[] = Game.ships.filter(
        (s) => s.hitsNumber < s.length
      );

      for (const ship of unSunkShips) {
        unsunkShipsResp.unSunkShips.push({
          loc: { _x: ship.location.x, _y: ship.location.y },
          length: ship.length,
          type: ship.type,
        });
      }

      console.log("sending unsunk ships: ", unsunkShipsResp);

      ws.send(JSON.stringify(unsunkShipsResp));
    },

    handlePlayButtonClick(event: Event) {
      if (!Game.isArrangementCorrect()[0]) {
        this.showAlert("Корабли расставлены некорректно!");
        return;
      }

      Game.ships.forEach((ship) => {
        ship.draw(this.getContext(), "black", false);
      });

      const clientUuid = this.getClientUuid;
      if (!clientUuid) return;

      const ws: WebSocket = this.getWebSocket;

      ws.send(
        JSON.stringify({
          msg_type: MessageType.SHIPS_ARE_ARRANGED,
        })
      );

      if (event) (<HTMLButtonElement>event.target).disabled = true;
      this.endGameButtonDisabled = false;

      // Удаляем обработчики событий мыши, чтобы игрок не мог менять расстановку кораблей во время игры
      GameStore.dispatch("removeOwnGridEventListeners");
    },

    handleFinishButtonClick(event: Event) {
      window.location.reload();
    },

    setInitialInputElementState() {
      this.enemyNickName = "";
      this.enemyState = EnemyState.WAITING_FOR_ENEMY;
      this.topButtonDisabled = false;
      this.nicknameDisabled = false;
      this.infoComponentVisible = false;
      this.gameOverInfoIsVisible = false;
      this.playButtonDisabled = true;
      this.endGameButtonDisabled = true;
    },

    handleHostileGridClick(event: MouseEvent) {
      const enemyClientUuid = this.getEnemyClientUuid;
      if (!enemyClientUuid) {
        console.log("Enemy client UUID is not found");
        return;
      }

      let shotLocation: Location = Location.getLocationByOffsetXY(
        event.offsetX,
        event.offsetY
      );

      // Если каким-то образом игрок сделал выстрел по невалидной локации (вне границ сетки, например по координате з-0),
      // то выходим из метода
      if (!shotLocation.isValid()) return;

      if (Game.existsInShotHistory(shotLocation)) {
        this.showAlert(
          "Вы уже стреляли по этим координатам, выберите другие координаты для стрельбы",
          "warning"
        );
        return;
      }

      this.currentShot = shotLocation;

      const ws: WebSocket = this.getWebSocket;

      ws.send(
        JSON.stringify({
          msg_type: MessageType.FIRE_REQUEST,
          shot_location: shotLocation,
          enemy_client_id: enemyClientUuid,
        })
      );
    },
  },

  beforeRouteLeave(to: any, from: any, next: any) {
    if (this.isPlaying) {
      if (
        !window.confirm(
          "Игра будет завершена при переходе на другую вкладку. Перейти на другую вкладку ?"
        )
      ) {
        return;
      } else (this.getWebSocket as WebSocket).close();
    }
    next();
  },

  beforeMount() {
    window.addEventListener("beforeunload", this.preventNavAndUnload);
  },

  beforeUnmount() {
    window.removeEventListener("beforeunload", this.preventNavAndUnload);
  },

  mounted() {
    this.ctx_ = this.getContext2D;
    this.hostileCtx_ = this.getHostileContext2D;
  },
});
</script>

<style lang="css" scoped>
.alpos {
  top: 1rem;
  left: 1rem;
}

.maxw-400 {
  max-width: 25rem;
}

.minw-17 {
  min-width: 17rem;
}

.w-fit {
  width: fit-content;
}
</style>