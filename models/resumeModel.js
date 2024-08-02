const mongoose = require("mongoose");

// Link Schema
const linkSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    type: {
      type: String,
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
      required: true,
    },
  },
  { _id: false }
);

// Other Sub-Schemas
const professionalExperienceSchema = new mongoose.Schema(
  {
    jobTitle: String,
    employer: String,
    city: String,
    country: String,
    startDate: Date,
    endDate: Date,
    description: String,
  },
  { _id: false }
);

const skillSchema = new mongoose.Schema(
  {
    skill: String,
    information: String,
    skillLevel: {
      type: String,
      enum: ["Beginner", "Amateur", "Competent", "Proficient", "Expert"],
    },
  },
  { _id: false }
);

const languageSchema = new mongoose.Schema(
  {
    language: String,
    information: String,
    levelLanguage: {
      type: String,
      enum: ["Beginner", "Amateur", "Competent", "Proficient", "Expert"],
    },
  },
  { _id: false }
);

const certificateSchema = new mongoose.Schema(
  {
    certificate: String,
    information: String,
  },
  { _id: false }
);

const interestSchema = new mongoose.Schema(
  {
    interest: String,
    information: String,
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    projectTitle: String,
    subTitle: String,
    city: String,
    country: String,
    startDate: Date,
    endDate: Date,
    description: String,
  },
  { _id: false }
);

const courseSchema = new mongoose.Schema(
  {
    courseTitle: String,
    institution: String,
    startDate: Date,
    endDate: Date,
    description: String,
  },
  { _id: false }
);

const awardSchema = new mongoose.Schema(
  {
    award: String,
    issuer: String,
    date: Date,
    description: String,
  },
  { _id: false }
);

const organizationSchema = new mongoose.Schema(
  {
    organization: String,
    position: String,
    city: String,
    country: String,
    startDate: Date,
    endDate: Date,
    description: String,
  },
  { _id: false }
);

const publicationSchema = new mongoose.Schema(
  {
    title: String,
    publisher: String,
    date: Date,
    description: String,
  },
  { _id: false }
);

const referenceSchema = new mongoose.Schema(
  {
    name: String,
    jobTitle: String,
    organization: String,
    email: String,
    phone: String,
  },
  { _id: false }
);

const declarationSchema = new mongoose.Schema(
  {
    text: String,
    signature: String,
  },
  { _id: false }
);

const customSchema = new mongoose.Schema(
  {
    icon: String,
    publicId: String,
    customName: String,
    title: String,
    subtitle: String,
    city: String,
    country: String,
    startDate: Date,
    endDate: Date,
    description: String,
  },
  { _id: false }
);

const contentSchema = new mongoose.Schema(
  {
    profile: String,
    education: [{ type: mongoose.Schema.Types.ObjectId, ref: "Education" }],
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
  },
  { _id: false }
);

// Resume Schema
const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  templateId: { type: mongoose.Schema.Types.ObjectId, ref: "Template" },
  coverImage: String,
  name: String,
  jobTitle: String,
  email: String,
  phone: String,
  address: String,
  photo: String,
  personalInfo: { type: Array },
  links: [linkSchema],
  content: contentSchema,
});

const Resume = mongoose.model("Resume", resumeSchema);

module.exports = Resume;
