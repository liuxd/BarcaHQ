let barca = {
  init: function() {
    this.banner()
    this.ranking()
    this.players()
    this.binding()
    $("#ranking-container").show()
  },
  binding: function() {
    $("li").each(function() {
      $(this).bind("click", function() {
        $("li").each(function() {
          $(this).removeClass("active")
        })

        $(".grid").each(function(){
          $(this).hide()
        })

        let mark = $(this)
          .addClass("active")
          .attr("id")
          .substring(4)

        $("#" + mark + "-container").show()
        console.log("#" + mark + "-container")
      })
    })
  },
  tbodyHandler: function(target_id, rows, rowClassHandler) {
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
  },
  ranking: function() {
    let that = this

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

      that.tbodyHandler("ranking", teamList, function(row) {
        return row[1] === "Barcelona" ? "success" : ""
      })
    })
  },
  players: function() {
    let that = this

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

      that.tbodyHandler("players", playerList, function(row) {
        return row[2] === "Barcelona" ? "success" : ""
      })
    })
  },
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
}

barca.init()
