import React, { useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';
import MenuItem from '@mui/material/MenuItem'; 
import Task from './Task';
import './App.css';
import { TaskContractAddress } from './config';
import TaskAbi from './TaskContract.json';
import { ethers } from 'ethers';


function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [priority, setPriority] = useState(1);
  const [currentAccount, setCurrentAccount] = useState('');
  const [correctNetwork, setCorrectNetwork] = useState(false);

  const getAllTasks = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi.abi,
          signer
        );
        let allTasks = await TaskContract.getMyTasks(0); 
        setTasks(allTasks);
      } else {
        console.log("Ethereum object does not exist.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllTasks();
  }, []);

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log('Metamask not detected.');
        return;
      }
      let chainId = await ethereum.request({ method: 'eth_chainId' });
      const sepoliaChainId = '0xaa36a7';
      if (chainId !== sepoliaChainId) {
        alert('You are not connected to the Sepolia Testnet.');
        return;
      } else {
        setCorrectNetwork(true);
      }
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log('Error connecting to MetaMask.', error);
    }
  };

  const addTask = async (event) => {
    event.preventDefault();
    let task = {
      'taskText': input,
      'isDeleted': false,
      'priority': priority,
      'dateTime': dateTime
    };
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi.abi,
          signer
        );
        await TaskContract.addTask(task.taskText, task.isDeleted, task.priority);
        setTasks([...tasks, task]);
      } else {
        console.log("Ethereum object does not exist.");
      }
    } catch (error) {
      console.log("Error submitting new task. ", error);
    }
    setInput('');
    setDateTime('');
  };

  const deleteTask = (key) => async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi.abi,
          signer
        );
        await TaskContract.deleteTask(key, true);
        let allTasks = await TaskContract.getMyTasks(0);
        setTasks(allTasks);
      } else {
        console.log("Ethereum object does not exist.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="header">TODO APP</div>
      {currentAccount === '' ? (
        <button className="connect-button" onClick={connectWallet}>
          Connect Wallet
        </button>
      ) : correctNetwork ? (
        <div>
          <form onSubmit={addTask}>
            <TextField
              label="Task Title"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <TextField
              select
              label="Priority"
              value={priority}
              onChange={(e) => setPriority(Number(e.target.value))}
            >
              <MenuItem value={1}>Low</MenuItem>
              <MenuItem value={2}>Medium</MenuItem>
              <MenuItem value={3}>High</MenuItem>
            </TextField>
            <TextField
              type="datetime-local"
              label="Date and Time"
              InputLabelProps={{ shrink: true }}
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
            />
            <button className="add-task-button">Add Task</button>
          </form>
          <ul>
            {tasks.map((task) => (
              <Task
                key={task.id}
                taskText={task.taskText}
                dateTime={task.dateTime}
                priority={task.priority}
                onClick={deleteTask(task.id)}
              />
            ))}
          </ul>
        </div>
      ) : (
        <div>Connect to Sepolia Testnet</div>
      )}

    </div>
  );
}

export default App;
