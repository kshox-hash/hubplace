export function bookingStateScript(): string {
  return `
let allSlots = [];
let selDate = null;
let selTime = null;
let currentStep = 1;
let selServiceId = null;
let selServiceName = null;
let selServicePrice = null;
`;
}