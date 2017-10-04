new Vue({
  el: "#app",
  data: {
    ranking_title: [
      "Position",
      "Team",
      "Played",
      "Won",
      "Drawn",
      "Lost",
      "Goal",
      "Against",
      "Goal Difference",
      "Points"
    ],
    players_title: ["Rank", "Player", "Club", "Goals"],
    ranking_grid: true,
    players_grid: false,
    rankingActive: true,
    playersActive: false,
    ranking_list: [],
    player_list: [],
    banner_img: "./app/img/loading_banner.gif",
    banner_content: ""
  },
  created: function() {
    let that = this

    // Banner
    $.get("http://www.espnfc.com/club/barcelona/83/fixtures", function(response) {
      let html = $(response)

      let date = html.find(".next-match h3 span").text()
      let teamName = ""
      let teamLogoURL = ""

      html.find(".next-match .team-name").each(function() {
        let name = $(this)
          .text()
          .replace(/(^\s*)|(\s*$)/g, "")
        let img = $(this)
          .find("img")
          .attr("src")

        if (name !== "Barcelona") {
          teamName = name
          teamLogoURL = img
        }

        that.banner_img = teamLogoURL
        that.banner_content = teamName + " " + date
      })
    })

    // Ranking List
    $.get("http://www.espnfc.com/spanish-primera-division/15/table", function(response) {
      let html = $(response)
      let teamList = []

      html.find("#tables-overall table tbody tr").each(function() {
        let row = $(this).children()
        let team = []

        row.each(function() {
          team.push($(this).text())
        })

        if (team[0] !== "POS") {
          teamList.push([
            team[0],
            team[1].replace(/(^\s*)|(\s*$)/g, ""),
            team[3],
            team[4],
            team[5],
            team[6],
            team[7],
            team[8],
            team[22],
            team[23]
          ])
        }
      })

      that.ranking_list = teamList
    })

    // Player List
    $.get("http://www.espnfc.com/spanish-primera-division/15/statistics/scorers", function(response) {
      let html = $(response)
      let playerList = []

      html.find("#stats-top-scorers table tbody tr").each(function() {
        let row = $(this).children()
        let player = []

        row.each(function() {
          player.push($(this).text())
        })

        playerList.push(player)
      })

      that.player_list = playerList
    })
  },
  methods: {
    switchTab: function(tab) {
      if (tab == "players") {
        this.players_grid = true
        this.playersActive = true

        this.ranking_grid = false
        this.rankingActive = false
      } else {
        this.players_grid = false
        this.playersActive = false

        this.ranking_grid = true
        this.rankingActive = true
      }
    },
    player_list: function() {
      $.get("http://www.espnfc.com/spanish-primera-division/15/statistics/scorers", function(response) {
        let html = $(response)
        let playerList = []

        html.find("#stats-top-scorers table tbody tr").each(function() {
          let row = $(this).children()
          let player = []

          row.each(function() {
            player.push($(this).text())
          })

          playerList.push(player)
        })
      })
    }
  }
})
