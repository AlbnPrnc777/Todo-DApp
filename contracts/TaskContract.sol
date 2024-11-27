// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

contract TaskContract {
    struct Task {
        uint256 id;
        address username;
        string taskText;
        bool isDeleted;
        uint8 priority; 
    }

    Task[] private tasks;

    mapping(uint256 => address) taskToOwner;

    event AddTask(address recipient, uint256 taskId);
    event DeleteTask(uint256 taskId, bool isDeleted);

    function addTask(string memory taskText, bool isDeleted, uint8 priority) external {
        require(priority >= 1 && priority <= 3, "Invalid priority level");
        uint256 taskId = tasks.length;
        tasks.push(Task(taskId, msg.sender, taskText, isDeleted, priority));
        taskToOwner[taskId] = msg.sender;
        emit AddTask(msg.sender, taskId);
    }

    function getMyTasks(uint8 priorityFilter) external view returns (Task[] memory) {
        Task[] memory temporary = new Task[](tasks.length);
        uint256 counter = 0;

        for (uint256 i = 0; i < tasks.length; i++) {
            if (
                taskToOwner[i] == msg.sender &&
                tasks[i].isDeleted == false &&
                (priorityFilter == 0 || tasks[i].priority == priorityFilter)
            ) {
                temporary[counter] = tasks[i];
                counter++;
            }
        }

        Task[] memory result = new Task[](counter);
        for (uint256 i = 0; i < counter; i++) {
            result[i] = temporary[i];
        }
        return result;
    }

    function deleteTask(uint256 taskId, bool isDeleted) external {
        if (taskToOwner[taskId] == msg.sender) {
            tasks[taskId].isDeleted = isDeleted;
            emit DeleteTask(taskId, isDeleted);
        }
    }
}
