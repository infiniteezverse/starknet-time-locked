use starknet::ContractAddress;
use starknet::get_caller_address;
use starknet::get_block_timestamp;
use crate::time_utils;

#[starknet::interface]
pub trait ITimeRegistry<TContractState> {
    fn set_deadline(ref self: TContractState, days: u64, hours: u64);
    fn get_deadline(self: @TContractState, user: ContractAddress) -> u64;
    fn get_remaining_time(self: @TContractState, user: ContractAddress) -> u64;
    fn is_expired(self: @TContractState, user: ContractAddress) -> bool;
    fn get_my_deadline(self: @TContractState) -> u64;
    fn get_my_remaining_time(self: @TContractState) -> u64;
    fn is_my_deadline_expired(self: @TContractState) -> bool;
}

#[starknet::contract]
pub mod TimeRegistry {
    use super::*;
    use starknet::storage::Map;
    use starknet::storage::StorageMapReadAccess;
    use starknet::storage::StorageMapWriteAccess;

    #[storage]
    pub struct Storage {
        // Map from user address to their deadline (Unix timestamp in seconds)
        deadlines: Map<ContractAddress, u64>,
    }

    #[abi(embed_v0)]
    impl TimeRegistryImpl of ITimeRegistry<ContractState> {
        // Set a new deadline for the caller
        // Calculates deadline as: now + (days * 86400) + (hours * 3600)
        fn set_deadline(ref self: ContractState, days: u64, hours: u64) {
            let caller = get_caller_address();
            let current_time = get_block_timestamp();
            let deadline = time_utils::calculate_deadline(current_time, days, hours);

            self.deadlines.write(caller, deadline);
        }

        // Get deadline for a specific user
        fn get_deadline(self: @ContractState, user: ContractAddress) -> u64 {
            self.deadlines.read(user)
        }

        // Get remaining time for a specific user
        fn get_remaining_time(self: @ContractState, user: ContractAddress) -> u64 {
            let deadline = self.deadlines.read(user);
            let current_time = get_block_timestamp();
            time_utils::time_remaining(deadline, current_time)
        }

        // Check if a specific user's deadline has expired
        fn is_expired(self: @ContractState, user: ContractAddress) -> bool {
            let deadline = self.deadlines.read(user);
            let current_time = get_block_timestamp();
            time_utils::is_expired(deadline, current_time)
        }

        // Get caller's own deadline
        fn get_my_deadline(self: @ContractState) -> u64 {
            let caller = get_caller_address();
            self.deadlines.read(caller)
        }

        // Get caller's own remaining time
        fn get_my_remaining_time(self: @ContractState) -> u64 {
            let caller = get_caller_address();
            let deadline = self.deadlines.read(caller);
            let current_time = get_block_timestamp();
            time_utils::time_remaining(deadline, current_time)
        }

        // Check if caller's deadline has expired
        fn is_my_deadline_expired(self: @ContractState) -> bool {
            let caller = get_caller_address();
            let deadline = self.deadlines.read(caller);
            let current_time = get_block_timestamp();
            time_utils::is_expired(deadline, current_time)
        }
    }
}
