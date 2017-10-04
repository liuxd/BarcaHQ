let tbodyHandler = function(target_id, rows, rowClassHandler) {
  let body = ""

  for (let row of rows) {
    let rowClass = rowClassHandler(row)
    let tr = "<tr>"

    if (rowClass) {
      tr = "<tr class='" + rowClass + "'>"
    }

    for (let td of row) {
      tr += "<td>" + td + "</td>"
    }

    tr += "</td>"

    body += tr
  }

  $("#" + target_id).html(body)
}

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
    playersActive: false
  },
  computed: {
    banner: function() {
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

          $("#banner").html("<img src='" + teamLogoURL + "'>" + teamName + " " + date)
        })
      })
    }
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
    ranking_list: function() {
      let tbody = ""

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

        tbody = tbodyHandler("ranking", teamList, function(row) {
          return row[1] === "Barcelona" ? "success" : ""
        })
      })

      return tbody
    },
    player_list: function() {
      let tbody = ""

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

        tbody = tbodyHandler("players", playerList, function(row) {
          return row[2] === "Barcelona" ? "success" : ""
        })
      })

      return tbody
    }
  }
})
