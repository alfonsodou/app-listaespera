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
          "0x8Fc95A4F80EbfC82C12f26d2c07Eff3dD14b7738",
          listaEsperaManifest.abi,
          signer
        );
        myContractTokenEspera.current = new Contract(
          "0x856C2f0cf914e1c27081141e33B4A9C2Fb2348eC",
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

  /**
   * Registrarse en la lista
   */
  let register = async () => {
    try {
      const tx = await myContractListaEspera.current.inscribirse();
      await tx.wait();

      await cargarDatos();
    } catch (err) {
      const error = decodeError(err);
      alert(error.error);
    }
  };

  /**
   * Posición en la lista
   */
  let getPosition = async () => {
    try {
      const tx = await myContractListaEspera.current.numeroEnLista();

      if (tx.isZero()) {
        alert("Todavía no estás inscrito en la lista");
      } else {
        alert("Ocupas la " + tx.toString() + " posición de la lista");
      }
    } catch (err) {
      const error = decodeError(err);
      alert(error.error);
    }
  };

  /**
   * Retirar primer inscrito de la lista
   */
  let unregisterAdmin = async () => {
    try {
      let result = await myContractListaEspera.current.retirarUsuarioAdmin();

      if (result) {
        alert("Primer usuario de la lista retirado");
      } else {
        alert("Ocurrió un problema al eliminar el primer usuario de la lista");
      }
    } catch (err) {
      const error = decodeError(err);
      alert(error.error);
    }
  };

  /**
   * Retirar usuario de la lista
   */
  let unregister = async () => {
    try {
      let result = await myContractListaEspera.current.retirarUsuario();

      if (result) {
        alert("Retirado correctamente de la lista");
      } else {
        alert("Ocurrió un error al retirarte de la lista");
      }

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
                ya tengas en tu cartera. Ahora mismo tienes {balance}{" "}
                {tokenName} en tu cartera.
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
              <Card.Title>Registro en Lista Espera</Card.Title>
              <Card.Text>
                Para registrarte en la lista deberás enviar 1 {tokenName}
              </Card.Text>
              <Button
                variant="primary"
                onClick={() => {
                  register();
                }}
              >
                Registrar
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card style={{ width: "18rem" }}>
            <Card.Body>
              <Card.Title>Posición en Lista Espera</Card.Title>
              <Card.Text>
                Puedes consultar que posición ocupas en la lista
              </Card.Text>
              <Button
                variant="primary"
                onClick={() => {
                  getPosition();
                }}
              >
                Posición
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card style={{ width: "18rem" }}>
            <Card.Body>
              <Card.Title>Retirar primer usuario lista</Card.Title>
              <Card.Text>Solo puede ejecutarlo el propietario</Card.Text>
              <Button
                variant="primary"
                onClick={() => {
                  unregisterAdmin();
                }}
              >
                Retirar
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card style={{ width: "18rem" }}>
            <Card.Body>
              <Card.Title>Retirarme de la lista</Card.Title>
              <Card.Text>
                Se te devolverá la mitad de los {tokenName} requeridos para
                registrarte
              </Card.Text>
              <Button
                variant="primary"
                onClick={() => {
                  unregister();
                }}
              >
                Retirarme
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
