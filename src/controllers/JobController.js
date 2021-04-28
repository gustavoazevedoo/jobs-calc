const Job = require("../model/Job")
const JobUtils = require("../utils/JobUtils")
const Profile = require("../model/Profile")

module.exports = {
  create(req, res) {
    return res.render('job')
  },
  async save(req, res) {
    await Job.create({
      name: req.body.name,
      "daily-hours": req.body["daily-hours"],
      "total-hours": req.body["total-hours"],
      created_at: Date.now()
    });

    return res.redirect("/")
  },
  async show(req, res) {
    const { id } = req.params
    const jobs = await Job.get();

    const job = jobs.find(job => job.id == id)

    if (!job) return res.send("Job not found!")

    const profile = await Profile.get();
    job.budget = JobUtils.calculateBudget(job, profile["value-hour"])

    res.render("job-edit", { job })
  },
  async update(req, res) {
    const { id } = req.params
   
    const updatedJob = {
      name: req.body.name,
      "total-hours": req.body["total-hours"],
      "daily-hours": req.body["daily-hours"]
    }

    await Job.update(updatedJob, id)

    res.redirect(`/job/${id}`)
  },
  async delete(req, res) {
    const { id } = req.params

    await Job.delete(id)

    return res.redirect("/")
  }
}