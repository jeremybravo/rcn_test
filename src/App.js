import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      robot:[{
        coordenada: '',
        instruccion: '',
        coordenada_error: '',
        instruccion_error: '',
        output:'',
        mapeo:''
      }],
      robotLost:[{
        coordenada: '',
        coordenadaAnterior: '',
        robot: ''
      }],
      marsLimit:[{
        x:3,
        y:3
      }]
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.buscarPosicionamiento = this.buscarPosicionamiento.bind(this);
    this.addRobot = this.addRobot.bind(this);
    this.deleteRobot = this.deleteRobot.bind(this);
  }

  handleInputChange(event) {

    let name = event.target.name;
    let value = event.target.value;
    let index = parseInt(name.split('_')[1]);
    name = name.split('_')[0];

    let robots = this.state.robot;

    robots[index][name] = value.toUpperCase();
    robots[index].instruccion_error = '';
    robots[index].coordenada_error = '';

    this.setState({
      robot: robots,
    });
  }

  buscarPosicionamiento(e){
    let robots = this.state.robot;
    robots.map(function(objet,index) {

      let c = objet.coordenada.split(' ');
      let i = objet.instruccion.split(' ');

      if(c.length == 3 && i.length >= 1){
        if (c.indexOf(',') >= 0 || c.indexOf('.') >= 0) { robots[index].coordenada_error = 'Error: los números que se ingresan tienen que ser enteros.'; }
        else{
          if(c[2] != 'N' && c[2] != 'E' && c[2] != 'S' && c[2] != 'W'){ robots[index].coordenada_error = 'Error: la orientación no es correcta, solo puede ser (N, E, S, W).'; }
          else{
            let iFilVacio = i.filter(function(obje,inde) {
              if(obje != ' '){
                return obje
              }
            })
            let iFilValidat = i.filter(function(obje,inde) {
              if(obje != 'L' && obje != 'R' && obje != 'F') {
                return obje
              }
            })

            if(iFilVacio.length == 0){
              robots[index].instruccion_error = 'Error: el campo tiene que tener como minimo una instrucción.';
            }
            else{
              if(iFilValidat.length >= 1){
                robots[index].instruccion_error = 'Error: la instrucción no es correcta, solo puede ser (L, R, F).';
              }
              else{
                let c_X = parseInt(c[0]);
                let c_Y = parseInt(c[1]);
                let c_O = c[2];

                let mapeo = '';
                const addMapeo = () =>{
                  mapeo += c_X + ' ' + c_Y + ' ' + c_O + ' | ';
                }
                addMapeo()

                const procesCoord_L = (val) => {
                  switch (c_O) {
                    case 'N':
                      c_O = 'W'
                      addMapeo()
                      break;
                    case 'E':
                      c_O = 'N'
                      addMapeo()
                      break;
                    case 'W':
                      c_O = 'S'
                      addMapeo()
                      break;
                    case 'S':
                      c_O = 'E'
                      addMapeo()
                      break;
                  }
                }

                const procesCoord_R = (val) => {
                  switch (c_O) {
                    case 'N':
                      c_O = 'E'
                      addMapeo()
                      break;
                    case 'E':
                      c_O = 'S'
                      addMapeo()
                      break;
                    case 'W':
                      c_O = 'N'
                      addMapeo()
                      break;
                    case 'S':
                      c_O = 'W'
                      addMapeo()
                      break;
                  }
                }

                const procesCoord_F = (val) => {
                  switch (c_O) {
                    case 'N':
                      c_Y++
                      addMapeo()
                      break;
                    case 'E':
                      c_X++
                      addMapeo()
                      break;
                    case 'W':
                      c_X--
                      addMapeo()
                      break;
                    case 'S':
                      c_Y--
                      addMapeo()
                      break;
                  }
                }

                i.map(function(obj,ind) {
                  switch (obj) {
                    case 'L':
                      procesCoord_L(obj)
                      break;
                    case 'R':
                      procesCoord_R(obj)
                      break;
                    case 'F':
                      procesCoord_F(obj)
                      break;
                  }
                });

                let result = c_X + ' ' + c_Y + ' ' + c_O;

                robots[index].output = result;
                robots[index].mapeo = mapeo;
                robots[index].instruccion_error = '';
                robots[index].coordenada_error = '';
              }
            }
          }
        }
      }
      else{
        if(c.length != 3){ robots[index].coordenada_error = 'Error: el campo tiene que tener un par de enteros y una orientación.'; }
      }
    })

    this.setState({
      robot: robots
    });
  }

  addRobot(e) {
    let newRobot = {
      coordenada: '',
      instruccion: '',
      coordenada_error: '',
      instruccion_error: '',
      output:'',
      mapeo:''
    }

    let robots = this.state.robot;

    robots.push(newRobot)

    this.setState({
      robot: robots,
    });
  }

  deleteRobot(e) {
    let name = e.target.name;
    let index = parseInt(name.split('_')[1]);

    let robots = this.state.robot.filter(function(obj,ind) {
      if(ind != index){ return obj;}
    });

    this.setState({
      robot: robots,
    });
  }

  render() {
    let txtRobot = (this.state.robot.length > 1) ? 'ROBOTS' : 'ROBOT';
    return (
      <div className="App">
        <div className="btn">
          <button className="btnAdd" onClick={this.addRobot}>
            AGREGAR ROBOT
          </button>
        </div>

        {
          this.state.robot.map((obj, ind) => {
            let nameRobot = 'ROBOT '+ (ind + 1);
            return (
              <div className="contentGral" key={'contentGral_'+ind}>
                <p className="nameRobot">
                  {nameRobot}
                  <button className="btnDelete" name={'deleteRobot_'+ind} onClick={this.deleteRobot}>
                    x
                  </button>
                </p>

                <div className="ContentInput">
                  <p>Entrada de datos:</p>

                  <div className="Coordenada">
                    <label> Coordenada: </label>
                    <input type="text" className="inputText" name={'coordenada_'+ind} value={this.state.robot[ind].coordenada} onChange={this.handleInputChange} />
                  </div>
                  <p className="LabelError"> {this.state.robot[ind].coordenada_error} </p>

                  <div className="Instruccion">
                    <label> Instrucción: </label>
                    <input type="text" className="inputText" maxLength="100" name={'instruccion_'+ind} value={this.state.robot[ind].instruccion} onChange={this.handleInputChange} />
                  </div>
                  <p className="LabelError"> {this.state.robot[ind].instruccion_error} </p>
                </div>

                <div className="ContentOutput">
                  <p>Salida de datos:</p>

                  <div className="Salida">
                    <label> {this.state.robot[ind].output} </label>
                  </div>
                </div>

                <div className="ContentMap">
                  <p>Mapeo de datos:</p>

                  <div className="Salida">
                    <label> {this.state.robot[ind].mapeo} </label>
                  </div>
                </div>
              </div>
            )
          })
        }

        <div className="btn">
          <button className="btnSubmit" onClick={this.buscarPosicionamiento}>
            {'BUSCAR POSICIONAMIENTO DE '+txtRobot}
          </button>
        </div>
      </div>
    );
  }
}

export default App;
