<template>
  <div class="container">
    <input
      class="form-control form-control-lg mb-4"
      placeholder="Введите ник"
      type="text"
      v-model="nickName"
      :disabled="nicknameDisabled"
    />
    <div
      v-if="this.captchaVisible"
      class="border border-secondary border-3 rounded-3 p-1 wfit mx-auto mb-4"
    >
      <CaptchaComponent @captchaOkButtonClicked="processCaptcha" />
    </div>
    <div class="d-flex flex-row flex-wrap mb-3 justify-content-center">
      <div class="w-100 maxw-400 pb-3 me-lg-5">
        <button
          class="btn btn-lg btn-dark p-3 w-100 text-nowrap"
          type="button"
          @click="handleRandomGameButtonClick"
          :disabled="topButtonDisabled"
        >
          Игра со случайным соперником
        </button>
      </div>
      <div class="w-100 maxw-400 pb-3 ms-lg-5">
        <button
          class="btn btn-lg btn-dark p-3 w-100 text-nowrap"
          type="button"
          :disabled="topButtonDisabled"
          @click="handleFriendGameButtonClick"
        >
          Игра с другом
        </button>
      </div>
      <!-- <div class="w-100 maxw-400 pb-3">
        <button
          class="btn btn-lg btn-dark p-3 w-100 text-nowrap"
          type="button"
          :disabled="topButtonDisabled"
        >
          Игра с компьютером
        </button>
      </div> -->
    </div>
    <div
      class="border border-dark border-2 rounded-3 mx-auto wfit mb-4"
      v-if="friendComponentVisible"
    >
      <FriendGameComponent
        :clientUUID="myUUIDforFriendGame"
        @friendUUIDUpdated="friendUUIDChanged"
        :friendInputDisabled="friendInputDisabled"
      />
    </div>
    <div
      class="border border-dark border-2 rounded-3 wfit mx-auto mb-4"
      v-if="arrangeRuleComponentVisible"
    >
      <ArrangementRuleComponent />
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
    <div
      class="d-flex flex-row flex-wrap mt-4 mb-4 mt-lg-3 justify-content-center"
    >
      <div class="minw-17">
        <button
          ref="playButton"
          class="btn btn-lg btn-success w-100 text-nowrap"
          type="button"
          @click="handlePlayButtonClick"
          :disabled="playButtonDisabled"
        >
          Играть
        </button>
      </div>
    </div>
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
  </div>
</template>

<script lang="ts">
import BattleBoardComponent from "../components/BattleBoardComponent.vue";
import GameOverInfoComponent from "../components/GameOverInfoComponent.vue";
import CaptchaComponent from "../components/CaptchaComponent.vue";
import ArrangementRuleComponent from "../components/ArrangementRuleComponent.vue";
import FriendGameComponent from "../components/FriendGameComponent.vue";
import { defineComponent } from "vue";
import ActionStore from "@/store/index";
import MessageType from "@/model/enums/MessageType";
import EnemyInfoComponent from "@/components/EnemyInfoComponent.vue";
import {
  v4 as uuidv4,
  parse as uuidParse,
  stringify as uuidStringify,
  MAX as MAX_UUID,
  NIL as NIL_UUID,
} from "uuid";
import {
  WSDataTransferRootType,
  FireResponseType,
  UnSunkShipsType,
  ShipType,
  GameCreationBodyType,
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
import GameType from "@/model/enums/GameType";

export default defineComponent({
  name: "BattleShipView",

  components: {
    BattleBoardComponent,
    EnemyInfoComponent,
    GameOverInfoComponent,
    CaptchaComponent,
    ArrangementRuleComponent,
    FriendGameComponent,
  },

  data() {
    return {
      gameType: 1,
      nickName: "",
      enemyNickName: "",
      enemyState: EnemyState.WAITING_FOR_ENEMY,
      topButtonDisabled: false,
      nicknameDisabled: false,
      infoComponentVisible: false,
      playButtonDisabled: true,
      myTurnToShoot: false,
      turnOrderHintsVisible: false,
      ctx_: CanvasRenderingContext2D,
      hostileCtx_: CanvasRenderingContext2D,
      enemyShotHint: "",
      currentShot: new Location(0, 0),
      gameOverInfoIsVisible: false,
      isWinner: false,
      isPlaying: false,
      captchaVisible: false,
      arrangeRuleComponentVisible: true,
      friendComponentVisible: false,
      myUUIDforFriendGame: "",
      friendUUID: "",
      friendInputDisabled: false,
    };
  },

  computed: {
    ...mapGetters([
      "getWebSocket",
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

    getHostileContext(): CanvasRenderingContext2D {
      return this.hostileCtx_ as unknown as CanvasRenderingContext2D;
    },

    processCaptcha(isCaptchaSuccess: boolean) {
      this.topButtonDisabled = !isCaptchaSuccess;
      this.captchaVisible = !isCaptchaSuccess;

      if (!isCaptchaSuccess) this.showAlert("Неверный код", "danger");
    },

    friendUUIDChanged(friendUUID_: string) {
      try {
        let parsedUUID = uuidStringify(uuidParse(friendUUID_));

        if (parsedUUID === MAX_UUID || parsedUUID === NIL_UUID) {
          this.showAlert("Некорректный UUID (NIL/MAX UUID)", "danger", 3000);
          return;
        }

        if (parsedUUID === this.myUUIDforFriendGame) {
          this.showAlert("UUID ваш и друга не могут совпадать", "danger", 5000);
          return;
        }

        // Если валидация UUID прошла успешно - сохраняем его
        this.friendUUID = parsedUUID;
        this.friendInputDisabled = true;
        this.playButtonDisabled = false;

        this.showAlert("UUID валидный", "success", 5000);
      } catch (error) {
        this.showAlert("Невалидный UUID", "danger", 7000);
      }
    },

    preventNavAndUnload(event: BeforeUnloadEvent) {
      if (!this.isPlaying) return;
      event.preventDefault();
      event.returnValue = "";
    },

    hideAlert() {
      GameStore.commit("hideAlert");
    },

    isNickNameValid(): boolean {
      return this.nickName.trim().length !== 0;
    },

    handleRandomGameButtonClick() {
      if (!this.isNickNameValid()) {
        this.showAlert("Для игры необходимо ввести ник!", "warning");
        return;
      }

      this.gameType = GameType.RANDOM;

      const gameCreationBody: GameCreationBodyType = {
        msg_type: MessageType.GAME_CREATION,
        game_type: GameType.RANDOM,
        nickName: this.nickName.trim(),
      };

      let clientUUID = uuidv4();
      console.log("Your clientUUID for random game: ", clientUUID);

      let ws: WebSocket = new WebSocket(
        `ws://${serverHost}:${serverPort}/client/${clientUUID}/ws`
      );

      this.setupSocketConnectionAndCreateRivalCouple(ws, gameCreationBody);

      this.isPlaying = true; // устанавливаем факт начала игры
      this.topButtonDisabled = true;
      this.nicknameDisabled = true;
      this.infoComponentVisible = true;
      this.arrangeRuleComponentVisible = false;
    },

    handleFriendGameButtonClick() {
      // При нажатии на кнопку "Игра с другом", в отличие от клика по кнопке "Игра со случайным соперником"
      // сокет соединение НЕ будет сразу установлено. Соединение будет установлено по нажатии кнопки играть

      // Здесь лишь будут сделаны некоторые проверки

      // для игры с другом также нужно будет ввести ник
      if (!this.isNickNameValid()) {
        this.showAlert("Для игры необходимо ввести ник!", "warning");
        return;
      }

      // устанавливаем тип игры
      this.gameType = GameType.FRIEND;

      // формируем свой UUID для игры с другом
      this.myUUIDforFriendGame = uuidv4();
      console.log(
        "Your clientUUID for friend game: ",
        this.myUUIDforFriendGame
      );

      this.isPlaying = true; // устанавливаем факт начала игры

      // скрываем/деактивируем определенные элементы
      this.friendComponentVisible = true;
      this.topButtonDisabled = true;
      this.nicknameDisabled = true;
      this.arrangeRuleComponentVisible = false;
    },

    setupSocketConnectionAndCreateRivalCouple(
      ws: WebSocket,
      gameCreationBody: GameCreationBodyType
    ) {
      ws.onopen = function (event) {
        console.log("Successfully connected to the websocket server...");
        ActionStore.dispatch("saveSocketAndCreateRivalCouple", {
          ws,
          gameCreationBody,
        });
      };

      const processData = this.processDataFromServer;
      ws.onmessage = async function (event: MessageEvent<string>) {
        await processData(event.data);
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

    showAlert(
      alertText: string,
      alertColor: string = "danger",
      delay: number = 3000
    ) {
      GameStore.commit("setAlert", { alertText, alertColor });
      setTimeout(this.hideAlert, delay);
    },

    async disableShooting() {
      this.getHostileContext().canvas.removeEventListener(
        "click",
        this.handleHostileGridClick
      );

      this.myTurnToShoot = false;
    },

    async enableShooting() {
      this.getHostileContext().canvas.addEventListener(
        "click",
        this.handleHostileGridClick
      );

      this.myTurnToShoot = true;
    },

    async changePlayButtonText() {
      if (this.gameType === GameType.FRIEND)
        (this.$refs.playButton as HTMLButtonElement).innerHTML =
          "Играть еще раз";
    },
    async processDataFromServer(dataFromServer: string) {
      let parsedData: WSDataTransferRootType = JSON.parse(dataFromServer);

      switch (parsedData.msg_type) {
        case MessageType.GAME_CREATION:
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
              "К сожалению, ваш соперник разорвал соединение и вышел из игры. Обновите страницу для новой игры",
              "danger",
              5000
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

            if (this.myTurnToShoot) await this.enableShooting();

            if (this.gameType === GameType.FRIEND)
              this.enemyNickName = parsedData.data.enemy_nickname;
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

            let ctx = this.getContext();

            let fireResponse: FireResponseType = {
              msg_type: MessageType.FIRE_RESPONSE,
              shot_result: ShotResult.MISS,
              enemy_client_id: this.getEnemyClientUuid,
            };

            let ship: Ship | undefined = Game.getShipByLocation(shot);
            // если наш корабль ранили
            if (ship) {
              ht = HighlightType.CROSS; // меняем тип выделения на "крест"
              ship.hitsNumber++; // увеличиваем счетчик ранений у подбитого корабля

              // находим диагональные локации
              let diags: Location[] = Game.getDiagonalLocations(shot);
              // подсвечиваем диагональные локации
              await Game.highlightDiagonals(ctx, diags);

              // если корабль только ранен
              if (ship.hitsNumber < ship.length) {
                fireResponse.shot_result = ShotResult.HIT;
              } else {
                // если корабль потоплен
                fireResponse.shot_result = ShotResult.SUNK;

                // формируем подбитый корабль
                let ss: ShipType = {
                  length: ship.length,
                  loc: { _x: ship.location.x, _y: ship.location.y },
                  type: ship.type,
                };

                fireResponse.sunkShip = ss;
                // находим боковые локации
                let edgeLocs = await Ship.getFrontAndBackLocations(
                  ss.length,
                  ss.loc._x,
                  ss.loc._y,
                  ss.type
                );

                // выделяем их на своем гриде
                for (const loc of edgeLocs) await loc.highlight(ctx);

                // Если все корабли потоплены, даем знать об этом противнику. Игра окончена!
                if (Game.allShipsAreSunk()) {
                  this.infoComponentVisible = false;
                  this.gameOverInfoIsVisible = true;
                  this.turnOrderHintsVisible = false;

                  // Отправляем сопернику информацию о завершение игры с типом сообщения GAME_OVER
                  const ws: WebSocket = this.getWebSocket;
                  ws.send(
                    JSON.stringify({
                      msg_type: MessageType.GAME_OVER,
                      enemy_client_id: this.getEnemyClientUuid,
                    })
                  );

                  // В случае игры с другом - меняем надпись на кнопке - "Играть еще раз"
                  await this.changePlayButtonText();
                }
              }

              await this.disableShooting();
            } else await this.enableShooting();

            await shot.highlight(ctx, ht);

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
            let hostileCtx = this.getHostileContext();

            let shot: Location = this.currentShot as Location;
            Game.addToShotHistory(shot);

            if (parsedData.data.shot_result === ShotResult.MISS) {
              // Если промахнулись
              await shot.highlight(hostileCtx);
              this.enemyShotHint = "";
              await this.disableShooting();
            } else {
              // если попали (ранили), то
              // подсвечивае локацию на вражеском гриде
              await shot.highlight(hostileCtx, HighlightType.CROSS);
              // находим диагональные локации
              let diags: Location[] = Game.getDiagonalLocations(shot);
              // подсвечиваем диагональные локации
              await Game.highlightDiagonals(hostileCtx, diags);
              // добавляем диагональные локации в историю выстрелов
              for (const loc of diags) Game.addToShotHistory(loc);

              // если от соперника пришла информация, что корабль потоплен
              if (parsedData.data.shot_result === ShotResult.SUNK) {
                let sunkShip = parsedData.data.sunkShip;
                if (sunkShip) {
                  // находим боковые локации
                  let edgeLocs = await Ship.getFrontAndBackLocations(
                    sunkShip.length,
                    sunkShip.loc._x,
                    sunkShip.loc._y,
                    sunkShip.type
                  );

                  // выделяем их на гриде соперника
                  for (const loc of edgeLocs) await loc.highlight(hostileCtx);
                  // и добавляем в историю выстрелов
                  for (const loc of edgeLocs) Game.addToShotHistory(loc);
                }
              }
            }
          }
          break;

        case MessageType.GAME_OVER:
          if (parsedData.is_status_ok) {
            this.infoComponentVisible = false;
            this.gameOverInfoIsVisible = true;
            this.turnOrderHintsVisible = false;
            this.isWinner = true;

            await this.disableShooting();
            // Отправим сопернику информацию о непотопленных кораблях
            await this.sendUnsunkShipsToEnemy();

            await this.changePlayButtonText();
          }
          break;

        case MessageType.UNSUNK_SHIPS:
          if (parsedData.is_status_ok) {
            let unsunkShips: Ship[] = parsedData.data.unSunkShips.map(
              (s) =>
                new Ship(s.length, s.type, new Location(s.loc._x, s.loc._y))
            );

            // Покажем где у соперника остались непотопленные корабли
            let hostileCtx_ = this.getHostileContext();
            unsunkShips.forEach((ship) => ship.draw(hostileCtx_, "red"));
          }
          break;

        default:
          break;
      }
    },

    async sendUnsunkShipsToEnemy() {
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

    processRandomGameCreation() {
      const ws: WebSocket = this.getWebSocket;

      ws.send(
        JSON.stringify({
          msg_type: MessageType.SHIPS_ARE_ARRANGED,
        })
      );
    },

    processFriendGameCreation() {
      // Создаем тело сообщения для создания игры с типом GameType.FRIEND
      // в тело также передаем id друга (friendUUID)
      const gameCreationBody: GameCreationBodyType = {
        msg_type: MessageType.GAME_CREATION,
        game_type: GameType.FRIEND,
        nickName: this.nickName.trim(),
        friendUUID: this.friendUUID,
      };

      // Сохраняем id друга в качестве id соперника
      ActionStore.commit("setEnemyClientUuid", this.friendUUID);

      let ws: WebSocket = new WebSocket(
        `ws://${serverHost}:${serverPort}/client/${this.myUUIDforFriendGame}/ws`
      );

      this.setupSocketConnectionAndCreateRivalCouple(ws, gameCreationBody);

      this.friendInputDisabled = true;
    },

    handlePlayButtonClick(event: Event) {
      if (Game.ships.length === 0) {
        this.showAlert("Корабли отсутствуют, обновите страницу!");
        return;
      }
      // очистим историю выстрелов на всякий случай
      Game.clearShotHistory();

      if (!Game.isArrangementCorrect()[0]) {
        this.showAlert("Корабли расставлены некорректно!");
        return;
      }

      if (this.gameType === GameType.RANDOM) this.processRandomGameCreation();
      else this.processFriendGameCreation();

      // Деактивируем кнопку "Играть"
      if (event) (<HTMLButtonElement>event.target).disabled = true;
      // Удаляем обработчики событий мыши (Pointer), чтобы игрок не мог менять расстановку кораблей во время игры
      GameStore.dispatch("removeOwnGridEventListeners");
    },

    setInitialInputElementState() {
      this.enemyNickName = "";
      this.enemyState = EnemyState.WAITING_FOR_ENEMY;
      this.topButtonDisabled = false;
      this.nicknameDisabled = false;
      this.infoComponentVisible = false;
      this.gameOverInfoIsVisible = false;
      this.playButtonDisabled = true;
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
        this.showAlert("Вы уже стреляли сюда", "warning");
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
  bottom: 1rem;
  left: 1rem;
}

.maxw-400 {
  max-width: 25rem;
}

.minw-17 {
  min-width: 17rem;
}
</style>