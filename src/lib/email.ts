import nodemailer from "nodemailer";
import UserModel from "@/models/user.model";

// Configure Mailtrap SMTP transport
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

// Email templates
const getCustomerEmailTemplate = (booking: any, status: string) => `
  <h1>Booking ${status.charAt(0).toUpperCase() + status.slice(1)}</h1>
  <p>Dear ${booking.customerName},</p>
  <p>Your booking with ${booking.wineryName} has been ${status}.</p>
  <p>Booking Details:</p>
  <ul>
    <li>Date: ${new Date(booking.date).toLocaleDateString()}</li>
    <li>Time: ${booking.time}</li>
    <li>Guests: ${booking.guests}</li>
  </ul>
  <p>Thank you for using our platform!</p>
`;

const getWineryEmailTemplate = (booking: any, status: string) => `
  <h1>New Booking Update</h1>
  <p>Dear ${booking.wineryName} Team,</p>
  <p>A booking has been ${status}.</p>
  <p>Booking Details:</p>
  <ul>
    <li>Customer: ${booking.customerName}</li>
    <li>Date: ${new Date(booking.date).toLocaleDateString()}</li>
    <li>Time: ${booking.time}</li>
    <li>Guests: ${booking.guests}</li>
  </ul>
`;

const getAdminEmailTemplate = (booking: any, status: string) => `
  <h1>Booking Status Update Notification</h1>
  <p>Booking ID: ${booking._id}</p>
  <p>A booking has been ${status}.</p>
  <p>Details:</p>
  <ul>
    <li>Winery: ${booking.wineryName}</li>
    <li>Customer: ${booking.customerName}</li>
    <li>Date: ${new Date(booking.date).toLocaleDateString()}</li>
    <li>Time: ${booking.time}</li>
    <li>Guests: ${booking.guests}</li>
  </ul>
`;

// Send emails for a single winery booking
export async function sendBookingEmails(booking: any, winery: any, user: any, status: string) {
  try {
    // Validate inputs
    if (!user?.email) throw new Error("User email is missing");
    if (!winery?.wineryEmail) throw new Error(`Winery email is missing for winery ID: ${winery.wineryId}`);
    if (!winery?.datetime) throw new Error(`Datetime is missing for winery ID: ${winery.wineryId}`);

    const [date, time] = winery.datetime.split("T"); // Split ISO datetime
    if (!date || !time) throw new Error(`Invalid datetime format: ${winery.datetime}`);

    const emailData = {
      _id: booking._id,
      customerName: user.name || "Customer",
      customerEmail: user.email,
      wineryName: winery.wineryName || "Unknown Winery",
      wineryEmail: winery.wineryEmail,
      date: date,
      time: time.split(":").slice(0, 2).join(":"), // Extract HH:mm
      guests: winery.numberOfGuests || 0,
    };

    // Fetch admin users
    const adminUsers = await UserModel.find({ role: "admin" }).select("email");
    if (!adminUsers.length) {
      console.warn("No admin users found for sending admin emails");
    }

    const emails = [
      {
        to: emailData.customerEmail,
        subject: `Booking ${status} - ${emailData.wineryName}`,
        html: getCustomerEmailTemplate(emailData, status),
      },
      {
        to: emailData.wineryEmail,
        subject: `Booking ${status} Notification`,
        html: getWineryEmailTemplate(emailData, status),
      },
      ...adminUsers.map((admin) => ({
        to: admin.email,
        subject: `Admin: Booking ${status} - ${emailData._id}`,
        html: getAdminEmailTemplate(emailData, status),
      })),
    ].filter(email => email.to); // Filter out any undefined emails

    const emailResults = await Promise.all(
      emails.map((email) =>
        transporter.sendMail({
          from: process.env.EMAIL_FROM,
          ...email,
        }).then((info) => ({ status: "success", to: email.to, messageId: info.messageId }))
          .catch((error) => ({ status: "error", to: email.to, error: error.message }))
      )
    );

    console.log("Email sending results:", emailResults);
    return emailResults;
  } catch (error: any) {
    console.error(`Error in sendBookingEmails for winery ID ${winery.wineryId}:`, error);
    return [{ status: "error", error: (error && error.message) ? error.message : String(error) }];
  }
}