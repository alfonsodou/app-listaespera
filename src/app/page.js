"use client"
import { useState, useRef, useEffect } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
//import subastaManifest from "../contracts/Subasta.json";
import { ethers, Contract } from "ethers";
import { decodeError } from "@ubiquity-os/ethers-decode-error";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Home() {
  return (
    <Container>
      <h1>Hola mundo</h1>
    </Container>
  );
}
