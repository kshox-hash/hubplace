export function bookingDomScript(): string {
  return `
const stepService = document.getElementById("stepService");
const stepDate = document.getElementById("stepDate");
const stepTime = document.getElementById("stepTime");
const stepForm = document.getElementById("stepForm");
const servicesContainer = document.getElementById("servicesContainer");
const stepsTrack = document.getElementById("stepsTrack");

const datesContainer = document.getElementById("datesContainer");
const timesContainer = document.getElementById("timesContainer");
const timeSectionTitle = document.getElementById("timeSectionTitle");

const summaryDateEl = document.getElementById("summaryDate");
const summaryTimeEl = document.getElementById("summaryTime");

const btnBackDate = document.getElementById("btnBackDate");
const btnBackTime = document.getElementById("btnBackTime");
const btnSubmit = document.getElementById("btnSubmit");

const messageEl = document.getElementById("messageEl");
const successScreen = document.getElementById("successScreen");
const successDetail = document.getElementById("successDetail");
const mainContent = document.getElementById("mainContent");
`;
}