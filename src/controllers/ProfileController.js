const Profile = require("../model/Profile")

module.exports = {
  async index(req, res) {
    return res.render('profile', { profile: await Profile.get() })
  },

  async update(req, res) {
    // req.body pra pegar os dados
    const data = req.body

    // definir quantas semanas tem um ano: 52
    const weeksPerYear = 52

    // remover as semanas de ferias do ano, para pegar quantas semanas tem em 1 mes
    const weeksPerMonth = (weeksPerYear - data["vacation-per-year"] ) / 12

    // quantas horas por semana estou trabalhando
    const weekTotalHours = data["hours-per-day"] * data["days-per-week"]

    // total de horas trabalhadas no mễs
    const monthlyTotalHours = weekTotalHours * weeksPerMonth

    // Qual sera o valor da minha hora?
    const valueHour = data["monthly-budget"] / monthlyTotalHours

    const profile = await Profile.get();
    
    await Profile.update({
      ...profile,
      ...req.body,
      "value-hour": valueHour
    })

    return res.redirect("/profile")
  }
}
  