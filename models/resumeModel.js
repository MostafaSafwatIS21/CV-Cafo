const mongoose = require("mongoose");
const { EmailSingature } = require("./m.me");

const linkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  enum: [
    "Website",
    "LinkedIn",
    "X (Twitter)",
    "Medium",
    "Github",
    "Orcid",
    "Skype",
    "Discord",
    "Dribbble",
    "Behance",
    "Stackoverflow",
    "GitLab",
    "Quora",
    "Facebook",
    "Instagram",
    "WeChat",
    "Kaggle",
    "Youtube",
    "TikTok",
    "Signal",
    "Telegram",
    "WhatsApp",
    "PayPal",
    "AngelList",
    "Product Hunt",
    "ArtStation",
    "CodePen",
    "Fiverr",
    "Hashnode",
    "Pluralsight",
    "ResearchGate",
    "IMDb",
    "Qwiklabs",
    "Google Play",
    "Tumblr",
    "Tripadvisor",
    "Yelp",
    "Slack",
    "Flickr",
    "ReverbNation",
    "DeviantArt",
    "Vimeo",
    "Reddit",
    "Pinterest",
    "Blogger",
    "Spotify",
    "Bitcoin",
    "App Store",
    "WordPress",
    "LeetCode",
    "CodeChef",
    "Codecademy",
    "Codeforces",
    "VSCO",
    "Snapchat",
    "Upwork",
    "GeeksforGeeks",
    "Google Scholar",
    "LINE",
    "TryHackMe",
    "Coursera",
    "ProtonMail",
    "HackerEarth",
    "CodeWars",
    "Hack The Box",
    "Bitbucket",
    "Gitea",
    "Xing",
    "500px",
    "dev.to",
    "HackerRank",
    "QQ",
    "Ethereum",
    "StopStalk",
    "Toptal",
    "Polywork",
    "Replit",
    "Credly",
    "Figma",
    "Gmail",
    "Tableau",
    "npm",
    "HackerOne",
    "Freelancer",
    "DataCamp",
    "Mastodon",
    "Letterboxd",
    "Zoom",
    "Audioboom",
    "SoundCloud",
    "Soundcharts",
    "KakaoTalk",
    "Salesforce",
    "Itch.io",
    "Sololearn",
    "OpenSea",
    "Devpost",
    "Linktree",
    "CodingGame",
    "Coding Ninjas",
    "Unsplash",
    "Indeed",
    "Handshake",
    "Steam",
    "Google",
    "Calendly",
  ],
});
const professionalExperienceSchema = new mongoose.Schema({
  jopTitle: String,
  Employer: String,
  city: String,
  country: String,
  startDate: Date,
  endDate: Date,
  description: String,
});
const skillSchema = new mongoose.Schema({
  skill: String,
  Information: String,
  skillLevel: {
    type: String,
    enum: ["Beginner", "Amateur", "Competent", "Proficient", "Expert"],
  },
});

const languageSchema = new mongoose.Schema({
  language: String,
  Information: String,
  levelLanguage: {
    type: String,
    enum: ["Beginner", "Amateur", "Competent", "Proficient", "Expert"],
  },
});

const certificateSchema = new mongoose.Schema({
  certificate: String,
  Information: String,
});

const interestSchema = new mongoose.Schema({
  certificate: String,
  Information: String,
});

const projectSchema = new mongoose.Schema({
  projectTitle: String,
  subTitle: String,
  city: String,
  country: String,
  startDate: Date,
  endDate: Date,
  description: String,
});

const courseSchema = new mongoose.Schema({
  courseTitle: String,
  Institution: String,
  startDate: Date,
  endDate: Date,
  description: String,
});
const awardSchema = new mongoose.Schema({
  Award: String,
  Issuer: String,
  date: Date,
  description: String,
});
const organizationSchema = new mongoose.Schema({
  organization: String,
  Position: String,
  city: String,
  country: String,
  startDate: Date,
  endDate: Date,
  description: String,
});
const publicationSchema = new mongoose.Schema({
  title: String,
  Publisher: String,
  date: Date,
  description: String,
});
const referenceSchema = new mongoose.Schema({
  name: String,
  jopTitle: String,
  organization: String,
  email: String,
  phone: String,
});
const declarationSchema = new mongoose.Schema({
  text: String,
  singature: {
    type: String,
  },
});
const customSchema = new mongoose.Schema({
  icon: {
    type: String,
    publicId: String, //photo
  },
  customName: String,
  title: String,
  subtitle: String,
  city: String,
  country: String,
  startDate: Date,
  endDate: Date,
  description: String,
});

////
const contentSchema = new mongoose.Schema({
  profile: String,
  education: [educationSchema], // Define educationSchema
  professionalExperience: [professionalExperienceSchema],
  skills: [skillSchema],
  languages: [languageSchema],
  certificates: [certificateSchema],
  interests: [interestSchema],
  projects: [projectSchema],
  courses: [courseSchema],
  awards: [awardSchema],
  organizations: [organizationSchema],
  publications: [publicationSchema],
  references: [referenceSchema],
  declaration: [declarationSchema],
  custom: [customSchema],
});

const resumeSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  templateId: { type: mongoose.Schema.Types.ObjectId, ref: "Template" },
  name: String,
  jopTitle: String,
  email: String,
  phone: String,
  address: String,
  photo: {
    type: String,
  },
  personalInfo: {
    type: Array,
  },
  links: [linkSchema],
  content: contentSchema,
});
const Resume = mongoose.model("Resume", resumeSchema);

module.exports = Resume;
