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
          "0x8bEEcC63cED136695945486d954B0520Ceef6d62",
          listaEsperaManifest.abi,
          signer
        );
        myContractTokenEspera.current = new Contract(
          "0x1505C3F9A8eaDA4c1DeF27053568d13d6BAe7A7d",
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
        
      </Row>
    </Container>
  );
}
