import './style.css';
import { useState } from 'react';
import Box from "@mui/material/Box";
import {PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import Profile from '../Profile';

function Header({ isNavOpen, onToggleNav }) {
  // const [isNavOpen, setIsNavOpen] = useState(true);


  // const toggleNav = () => {
  //   setIsNavOpen(!isNavOpen);
  // }

  return <>
    <header>
      <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", height: "5vh" }} className="left-container">
        <button className="toggle-button" onClick={onToggleNav}>
          {isNavOpen ? <PanelLeftClose /> : <PanelLeftOpen />}
        </button>
        <Box className="app-title">UTORAwards</Box>
      </Box>
      
      <Profile/>
    </header>   
  </>
}

export default Header;
