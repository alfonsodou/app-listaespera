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
import Card from "react-bootstrap/Card";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Home() {
  const myContractListaEspera = useRef(null);
  const myContractTokenEspera = useRef(null);
  const [tokenName, setTokenName] = useState("");
  const [balance, setBalance] = useState(0);

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
          "0x9813CB6ea72e45c189b074957a9a5629B2b0D318",
          listaEsperaManifest.abi,
          signer
        );
        myContractTokenEspera.current = new Contract(
          "0x005C091834dF98d09531CD4eF186A99bcD93C0ec",
          tokenEsperaManifest.abi,
          signer
        );
      } else {
        console.log("No se puede conectar con el provider");
      }
    } catch (err) {
      const error = decodeError(err);
      console.log(error);
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

      let balanceTemp = await myContractListaEspera.current.getBalance();
      setBalance(ethers.utils.formatEther(balanceTemp));
    } catch (err) {
      const error = decodeError(err);
      alert(error.error);
    }
  };

  /**
   * Comprar Token
   */
  let buyToken = async () => {
    try {
      const tx = await myContractListaEspera.current.comprarToken();
      await tx.wait();

      await cargarDatos();
    } catch (err) {
      const error = decodeError(err);
      alert(error.error);
    }
  };



  return (
    <Container>
      <Row>
        <Col>
          <Alert>
            <Alert.Heading>
              <p align="center">
                Bienvenido a la aplicación de Lista de Espera
              </p>
            </Alert.Heading>
          </Alert>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card style={{ width: "18rem" }}>
            <Card.Body>
              <Card.Title>Comprar {tokenName}</Card.Title>
              <Card.Text>
                Aprovecha esta oferta! Recibirás un token extra por cada uno que
                ya tengas en tu cartera.
                Ahora mismo tienes {balance} {tokenName} en tu cartera.
              </Card.Text>
              <Button
                variant="primary"
                onClick={() => {
                  buyToken();
                }}
              >
                Comprar!
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card style={{ width: "18rem" }}>
            <Card.Body>
              <Card.Title>Saldo de {tokenName}</Card.Title>
              <Card.Text>
                Pulsa el botón para conocer tu saldo actual.
              </Card.Text>
              <Button
                variant="primary"
                onClick={() => {
                  getBalance();
                }}
              >
                Saldo
              </Button>
            </Card.Body>
          </Card>
        </Col>        
      </Row>
    </Container>
  );
}
