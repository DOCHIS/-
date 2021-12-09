// lib
module.exports = function () {
  let raids = {
    '아브56': {
      '노말': {},
      '하드': {}
    },
    '아브34': {
      '노말': {},
      '하드': {}
    },
    '아브12': {
      '노말': {},
      '하드': {}
    },
    '쿠크세이튼': {
      '노말': {}
    },
    '비아': {
      '노말': {},
      '하드': {}
    },
    '발탄': {
      '노말': {},
      '하드': {}
    },
    '아르고스': {
      '3페': {}
    },
    '오레하': {
      '노말': {},
      '하드': {}
    },
  };
  let data = {};
  let character = [];

  return {

    /**
     * 초기화
     */
    init(list) {
      data = { 'characters': [] };

      // init
      raidsList.forEach((raid) => {
        data[raid] = {
          reward: this.reward(raid).gold,
          list: []
        };
      });

      // 리스트 입력 및 재배치
      character = list;
      this.listCollocate();

      return this;
    },

    /**
     * list를 레벨별로 data에 배치
     */
    listCollocate() {

      character.forEach((row) => {
      });

    },

    /**
     * 레이드 리워드
     */
    reward(name) {
      let data = {
        아브하드56: { gold: 2000 },
        아브하드34: { gold: 2000 },
        아브하드12: { gold: 5000 },
        아브노말56: { gold: 1500 },
        아브노말34: { gold: 1500 },
        아브노말12: { gold: 4500 },
        쿠크세이튼: { gold: 4500 },
        비아하드: { gold: 4500 },
        발탄하드: { gold: 4500 },
        비아노말: { gold: 3300 },
        발탄노말: { gold: 3300 },
        아르고스3페: { gold: 3300 },
        오레하하드: { gold: 1700 },
        오레하노말: { gold: 1500 },
      };

      if (name)
        return data[name];

      return data;
    },

    /**
     * 계산 결과 가져오기
     */
    get() {
      return data;
    }

  }
}
