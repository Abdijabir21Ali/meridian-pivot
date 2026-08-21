const express = require("express");

const app = express();
app.use(express.json());

const PORT = 3000;

// Temporary attendees — we'll replace this with a database later.
const attendees = [
  { id: "A001", name: "Ahmed Ali", checkedIn: false },
  { id: "A002", name: "Fatuma Hassan", checkedIn: false },
  { id: "A003", name: "Mohamed Omar", checkedIn: false }
];

// Fake synchronous badge printer
function printBadge(attendee) {
  console.log(`Printing badge for ${attendee.name}...`);

  return {
    success: true,
    message: `Badge printed for ${attendee.name}`
  };
}

// Check-in endpoint
app.post("/check-in", (req, res) => {
  const { attendeeId } = req.body;

  const attendee = attendees.find(
    (person) => person.id === attendeeId
  );

  if (!attendee) {
    return res.status(404).json({
      success: false,
      message: "Attendee not found"
    });
  }

  // Prevent duplicate badge printing
  if (attendee.checkedIn) {
    return res.status(409).json({
      success: false,
      message: "Attendee is already checked in"
    });
  }

  // ORIGINAL REQUIREMENT:
  // Call printer and WAIT for successful printing.
  const printResult = printBadge(attendee);

  if (!printResult.success) {
    return res.status(500).json({
      success: false,
      message: "Badge printing failed"
    });
  }

  // Only mark checked-in AFTER successful printing.
  attendee.checkedIn = true;

  res.json({
    success: true,
    status: "Checked In",
    attendee: attendee.name,
    message: printResult.message
  });
});

app.get("/", (req, res) => {
  res.send("Meridian Pivot - Event Check-in Service");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});