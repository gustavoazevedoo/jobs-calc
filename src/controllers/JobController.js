const Job = require("../model/Job")
const JobUtils = require("../utils/JobUtils")
const Profile = require("../model/Profile")

module.exports = {
  index: (req, res) => {
    const jobs = Job.get();
    const profile = Profile.get();

    const updatedJobs = jobs.map((job) => {
      // Ajustes no job
      const remaining = JobUtils.remainingDays(job)
      const status = remaining <= 0 ? 'done' : 'progress'

      return {
        ...job,
        remaining,
        status,
        budget: JobUtils.calculateBudget(job, profile["value-hour"])
      }
    })

    return res.render('index', { jobs: updatedJobs })
  },
  create: (req, res) => {
    return res.render('job')
  },
  save: (req, res) => {
    const jobs = Job.get();
    // req.body = { name: 'asdf', 'daily-hours': '2', 'total-hours': '2' }
    const lastId = jobs[jobs.length - 1]?.id || 0
    jobs.push({
      id: lastId + 1,
      name: req.body.name,
      "daily-hours": req.body["daily-hours"],
      "total-hours": req.body["total-hours"],
      created_at: Date.now()
    })

    return res.redirect("/")
  },
  show: (req, res) => {
    const { id } = req.params
    const jobs = Job.get();

    const job = jobs.find(job => job.id == id)

    if (!job) return res.send("Job not found!")

    const profile = Profile.get();
    job.budget = JobUtils.calculateBudget(job, profile["value-hour"])

    res.render("job-edit", { job })
  },
  update: (req, res) => {
    const { id } = req.params
    const jobs = Job.get();

    const job = jobs.find(job => job.id == id)

    if (!job) return res.send("Job not found!")

    const updatedJob = {
      ...job,
      name: req.body.name,
      "total-hours": req.body["total-hours"],
      "daily-hours": req.body["daily-hours"]
    }

    const newJobs = jobs.map(job => {
      if (job.id == id) {
        job = updatedJob
      }

      return job
    })

    Job.update(newJobs)

    res.redirect(`/job/${id}`)
  },
  delete: (req, res) => {
    const { id } = req.params

    Job.delete(id)

    return res.redirect("/")
  }
}