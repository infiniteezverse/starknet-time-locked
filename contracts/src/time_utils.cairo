// Time conversion utilities for Starknet
// All time is represented as Unix timestamps (seconds since epoch)

pub const SECONDS_IN_MINUTE: u64 = 60;
pub const SECONDS_IN_HOUR: u64 = 3_600;
pub const SECONDS_IN_DAY: u64 = 86_400;

// Calculate a future deadline by adding days and hours to a start time
// start_time: Unix timestamp in seconds
// days: Number of days to add
// hours: Additional hours to add
// Returns: Future Unix timestamp
pub fn calculate_deadline(start_time: u64, days: u64, hours: u64) -> u64 {
    let day_seconds = days * SECONDS_IN_DAY;
    let hour_seconds = hours * SECONDS_IN_HOUR;
    start_time + day_seconds + hour_seconds
}

// Calculate how many seconds remain until a deadline
// deadline: Target Unix timestamp
// current_time: Current Unix timestamp (usually from get_block_timestamp)
// Returns: Seconds remaining, or 0 if deadline has passed
pub fn time_remaining(deadline: u64, current_time: u64) -> u64 {
    if current_time >= deadline {
        0
    } else {
        deadline - current_time
    }
}

// Check if a deadline has passed
// deadline: Target Unix timestamp
// current_time: Current Unix timestamp
// Returns: true if deadline has passed, false otherwise
pub fn is_expired(deadline: u64, current_time: u64) -> bool {
    current_time >= deadline
}

// Format seconds into human-readable components
// seconds: Total seconds to format
// Returns: Tuple of (days, hours, minutes, seconds)
fn format_time(total_seconds: u64) -> (u64, u64, u64, u64) {
    let days = total_seconds / SECONDS_IN_DAY;
    let remaining = total_seconds % SECONDS_IN_DAY;

    let hours = remaining / SECONDS_IN_HOUR;
    let remaining = remaining % SECONDS_IN_HOUR;

    let minutes = remaining / SECONDS_IN_MINUTE;
    let secs = remaining % SECONDS_IN_MINUTE;

    (days, hours, minutes, secs)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_calculate_deadline_one_day() {
        let start = 1000_u64;
        let result = calculate_deadline(start, 1, 0);
        assert!(result == 1000 + SECONDS_IN_DAY, "Should add 1 day correctly");
    }

    #[test]
    fn test_calculate_deadline_days_and_hours() {
        let start = 1000_u64;
        let result = calculate_deadline(start, 5, 3);
        let expected = 1000 + (5 * SECONDS_IN_DAY) + (3 * SECONDS_IN_HOUR);
        assert!(result == expected, "Should add days and hours correctly");
    }

    #[test]
    fn test_time_remaining_with_future_deadline() {
        let current = 1000_u64;
        let deadline = current + 10000;
        let remaining = time_remaining(deadline, current);
        assert!(remaining == 10000, "Should calculate remaining time correctly");
    }

    #[test]
    fn test_time_remaining_with_passed_deadline() {
        let current = 10000_u64;
        let deadline = current - 1000;
        let remaining = time_remaining(deadline, current);
        assert!(remaining == 0, "Should return 0 for passed deadline");
    }

    #[test]
    fn test_is_expired_future() {
        let current = 1000_u64;
        let deadline = current + 10000;
        assert!(!is_expired(deadline, current), "Future deadline should not be expired");
    }

    #[test]
    fn test_is_expired_past() {
        let current = 10000_u64;
        let deadline = current - 1000;
        assert!(is_expired(deadline, current), "Past deadline should be expired");
    }

    #[test]
    fn test_format_time() {
        let seconds = (2 * SECONDS_IN_DAY) + (3 * SECONDS_IN_HOUR) + (45 * SECONDS_IN_MINUTE) + 30;
        let (days, hours, minutes, secs) = format_time(seconds);
        assert!(days == 2, "Should format days correctly");
        assert!(hours == 3, "Should format hours correctly");
        assert!(minutes == 45, "Should format minutes correctly");
        assert!(secs == 30, "Should format seconds correctly");
    }
}
