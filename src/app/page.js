"use client";
import { useState, useRef, useEffect } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import tokenEsperaManifest from "../contracts/TokenEspera.json";
import listaEsperaManifest from "../contracts/ListaEspera.json";
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
  const myContractListaEspera = useRef(null);
  const myContractTokenEspera = useRef(null);
  const [tokenName, setTokenName] = useState("");

  useEffect(() => {
    let init = async () => {
      await configurarBlockchain();
      await cargarDatos();
    };
    init();
  }, []);

  /**
   * Configura la red blockchain y carga el contrato Subasta
   *
   * @returns {void}
   */
  const configurarBlockchain = async () => {
    try {
      const provider = await detectEthereumProvider();

      if (provider) {
        await provider.request({ method: "eth_requestAccounts" });
        let providerEthers = new ethers.providers.Web3Provider(provider);
        let signer = providerEthers.getSigner();
        myContractListaEspera.current = new Contract(
          "0x9C7e03e9aAe92863e29a5Bd5eb3E7356Cb11cD27",
          listaEsperaManifest.abi,
          signer
        );
        myContractTokenEspera.current = new Contract(
          "0x82DB41D4a9F3fC17eAaa2E95ffe313205a128196",
          tokenEsperaManifest.abi,
          signer
        );
      } else {
        console.log("No se puede conectar con el provider");
      }
    } catch (err) {
      const error = decodeError(err);
      alert(error.error);
    }
  };

  /**
   * Almacena los datos del contrato
   *
   * @returns {void}
   */
  const cargarDatos = async () => {
    try {
      let tokenNameTemp = await myContractTokenEspera.current.name();
      setTokenName(tokenNameTemp);
    } catch (err) {
      const error = decodeError(err);
      alert(error.error);
    }
  };

  return (
    <Container>
      <h1>Hola mundo</h1>
      <h2>Token Name: {tokenName}</h2>
    </Container>
  );
}
