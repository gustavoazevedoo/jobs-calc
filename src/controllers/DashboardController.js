const Job = require("../model/Job")
const Profile = require("../model/Profile")
const JobUtils = require("../utils/JobUtils")

module.exports = {
  async index(req, res) {
    const jobs = await Job.get();
    const profile = await Profile.get();

    let statusCount = {
      progress: 0,
      done: 0,
      total: jobs.length
    }

    let jobTotalHours = 0

    const updatedJobs = jobs.map((job) => {
      // Ajustes no job
      const remaining = JobUtils.remainingDays(job);
      const status = remaining <= 0 ? 'done' : 'progress';
    
      // Somando a quantidade de status
      statusCount[status] += 1;

      jobTotalHours = status == 'progress' ? jobTotalHours += Number(job["daily-hours"]) : jobTotalHours
      // if(status == 'progress') {
      //   jobTotalHours += Number(job["daily-hours"])
      // }

      return {
        ...job,
        remaining,
        status,
        budget: JobUtils.calculateBudget(job, profile["value-hour"])
      }
    })

    // quantidade de horas que quero trabalhar/dia (profile) - quantidade de horas/dia de cada job em progress
    const freeHours = profile["hours-per-day"] - jobTotalHours;

    return res.render('index', { jobs: updatedJobs, profile, statusCount, freeHours })
  }
}