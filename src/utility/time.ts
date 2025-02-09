export function getFormattedIST(): string {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    });

    const formattedDate = formatter.format(now);
    const [datePart, timePart] = formattedDate.split(", ");
    const hours = now.toLocaleString("en-GB", { timeZone: "Asia/Kolkata", hour12: false, hour: "2-digit" });
    const amPmIST = parseInt(hours) >= 12 ? "PM" : "AM";

    return `Executed on: ${datePart.replace(" ", "-")} at ${timePart} ${amPmIST}`;
}
