import React, { Component } from 'react';
import './App.css';
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const url = '/clientes';

class App extends Component {
  state = {
    data: [],
    modalInsertar: false,
    modalEliminar: false,
    form: {
      _id: '',
      nombre: '',
      apellido: '',
      rut: '',
      tipo: '',
      telefono: '',
      activo: ''

    },
    tipoModal: ''
  }


//Metodos

  peticionGet = () => {
    axios.get(url).then(response => {
      this.setState({ data: response.data });
    }).catch(error => {
      console.log(error.message)
    })
  }

  peticionPost = async () => {
    delete this.state.form._id;
    await axios.post(url, this.state.form).then(response => {
      this.modalInsertar();
      this.peticionGet();
    }).catch(error => {
      console.log(error.message)
    })
  }

  peticionPut = () => {
    axios.put(url + '/' + this.state.form._id, this.state.form).then(response => {
      this.modalInsertar();
      this.peticionGet();
    }).catch(error => {
      console.log(error.message)
    })
  }


  peticionDelete = () => {
    axios.delete(url + '/' + this.state.form._id).then(response => {
      this.setState({ modalEliminar: false });
      this.peticionGet();
    }).catch(error => {
      console.log(error.message)
    })
  }

  componentDidMount() {
    this.peticionGet();

  }
/*
  componentDidUpdate(){
    this.peticionPut();
  }
*/
  modalInsertar = () => {
    this.setState({ modalInsertar: !this.state.modalInsertar })
  }

//Capturo el cliente quiero actualizar
  seleccionarCliente = (cliente) => {
    this.setState({
      tipoModal: 'actualizar',
      form: {
        _id: cliente._id,
        nombre: cliente.nombre,
        apellido: cliente.apellido,
        rut: cliente.rut,
        tipo: cliente.tipo,
        telefono: cliente.telefono,
        activo: cliente.activo,
      }
    })
  }


  handleChange = async e => {
    e.persist();
    await this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value
      }
    });
    console.log(this.state.form);
  }


  render() {
    const { form } = this.state;
    return (
      <React.Fragment>
        <div className='App'>
          <br />
          <button className="btn btn-success" onClick={() => { this.setState({ form: null, tipoModal: 'insertar' }); this.modalInsertar()}}
          >Nuevo cliente
        </button>
          <br /><br />

          <table className='table' >
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>RUT</th>
                <th>Tipo de Cliente</th>
                <th>Telefono</th>
                <th>Activos</th>
                <th></th>

              </tr>
            </thead>
            <tbody>
              {this.state.data.map(cliente => {

                return (
                  <tr key={cliente._id}>
                    <td>{cliente._id}</td>
                    <td>{cliente.nombre}</td>
                    <td>{cliente.apellido}</td>
                    <td>{cliente.rut}</td>
                    <td>{cliente.tipo}</td>
                    <td>{cliente.telefono}</td>
                    <td>{cliente.activo}</td>
                    <td>
                      <button
                        className="btn btn-primary" onClick={() => {this.seleccionarCliente(cliente); this.modalInsertar()}}> <FontAwesomeIcon icon={faEdit} />
                      </button>
                      {"   "}
                      <button className="btn btn-danger" onClick={() => {this.seleccionarCliente(cliente); this.setState({ modalEliminar: true })}}><FontAwesomeIcon icon={faTrashAlt} />
                      </button>
                    </td>
                  </tr>
                )
              }

              )}
            </tbody>

          </table>

          <Modal isOpen={this.state.modalInsertar}>
            <ModalHeader style={{ display: 'block' }}>
              <span style={{ float: 'right' }} onClick={() => this.modalInsertar()}>x</span>
            </ModalHeader>
            <ModalBody>
              <div className="form-group">
                <label htmlFor="id">ID</label>
                <input className="form-control" type="text" name="_id" id="_id" readOnly value={form ? form._id : this.state.data.length + 1} />
                <label htmlFor="id">Nombre</label>
                <input className="form-control" type="text" name="nombre" id="nombre" onChange={this.handleChange} value={form ? form.nombre : ''} />
                <label htmlFor="id">Apellido</label>
                <input className="form-control" type="text" name="apellido" id="apellido" onChange={this.handleChange} value={form ? form.apellido : ''} />
                <label htmlFor="id">RUT</label>
                <input className="form-control" type="text" name="rut" id="rut" onChange={this.handleChange} value={form ? form.rut : ''} />
                <label htmlFor="id">Tipo</label>
                <input className="form-control" type="text" name="tipo" id="tipo" onChange={this.handleChange} value={form ? form.tipo : ''} />
                <label htmlFor="id">Telefono</label>
                <input className="form-control" type="text" name="telefono" id="telefono" onChange={this.handleChange} value={form ? form.telefono : ''} />
                <label htmlFor="id">Activo</label>
                <input className="form-control" type="text" name="activo" id="activo" onChange={this.handleChange} value={form ? form.activo : ''} />

              </div>
            </ModalBody>

            <ModalFooter>
              {this.state.tipoModal === 'insertar' ?
                <button className="btn btn-success" onClick={() => this.peticionPost()}> Insertar</button> :
                <button className="btn btn-primary" onClick={() => this.peticionPut()}> Actualizar </button>
              }
              <button className="btn btn-danger" onClick={() => this.modalInsertar()}>Cancelar</button>
            </ModalFooter>
          </Modal>

          <Modal isOpen={this.state.modalEliminar}>
            <ModalBody>
              Estás seguro que deseas eliminar al cliente
          </ModalBody>

            <ModalFooter>
              <button className="btn btn-danger" onClick={() => this.peticionDelete()}>Sí</button>
              <button className="btn btn-secundary" onClick={() => this.setState({ modalEliminar: false })}>No</button>
            </ModalFooter>
          </Modal>


        </div>
      </React.Fragment>
    );
  }
}
export default App;