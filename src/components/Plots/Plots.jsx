import React from "react";
import Plot from 'react-plotly.js';

class Plots extends React.Component {
   
    // Constructor 
    constructor(props) {
        super(props);
   
        this.state = {
            dataFromApi: [], // this will be an array of data from API
            dataFromApiisLoaded: false // if data isn't loaded yet, it will be assigned as false and a message will be show on screen to  show the users that data from api is not loaded
        };

    }
    
    /* 
      promise object to fetch data from api, if the fetching is successful, data will be added to state
     */
    componentDidMount() {

      const apiEndpoint = "https://docs.openaq.org/v2/measurements?date_from=2000-01-01T00%3A00%3A00%2B00%3A00&     date_to=2022-04-08T13%3A46%3A00%2B00%3A00&limit=100&page=1&offset=0&sort=desc&radius=1000&country_id=DE&order_by=datetime";
        fetch(apiEndpoint)
            .then((response) => response.json())
            .then((json) => {
                this.setState({
                    dataFromApi: json.results,
                    dataFromApiisLoaded: true
                });
            })
    }

    /**  
      * the function transforms the data from api to the appropriate format for the Scattermapbox visualization
      * input: data, which will be data from api in the state
      * output: data in the appropriate format for Scattermapbox
     */
    transformDataForMap (data) {
      // hardcode parameters, it can be done by having unique parameters from data, but it is not really necessary
      const parameters = ["um025", "um100", "pm25", "pm10", "um010", "pm1"] 
      const colors = ['blue', 'green', 'red', 'cyan', 'yellow', 'magenta']

      let plotData = []

      for (let i=0; i< parameters.length; i++) {
        let location = [];
        let date = [];
        let lat = [];
        let lon = [];
        let parameter = [];
        let unit = [];
        let value = [];
        let hoverInfor = [];
        let size = [];

        data.forEach((d) => {
          if (d.parameter === parameters[i]){
            location.push(d.location)
            date.push(d.date.utc)
            lat.push(d.coordinates.latitude)
            lon.push(d.coordinates.longitude)
            parameter.push(d.parameter)
            value.push(d.value)
            unit.push(d.unit)
            hoverInfor.push(d.location + " - " + d.date.utc)
            size.push(d.value)

          }
        })
        plotData.push(
          {
            'name': parameters[i],
            'type': 'scattermapbox',
            'text': hoverInfor,
            'location': location,
            'size': size,
            'time': date,
            'lat': lat,
            'lon': lon,
            'value': value,
            'unit': unit,
            'opacity': 0.5,
            hovertemplate: // define the format of information showed on hover box
            "<b>%{text}</b><br>" +
            "lat: %{lat}<br>" +
            "lon: %{lon}<br>" +
            "value: %{marker.size}<br>" +
            "<extra></extra>"
            ,
            'marker': {
              size: size,
              color: colors[i],
            }
          }
        )
      }
      return plotData
    }

    /**  
      * the function transforms the data from api to the appropriate format for the stacked bar visualization
      * input: data, which will be data from api in the state
      * output: data in the appropriate format for stacked bar
     */
    transformDataForBarChart (data) {
      const parameters = ["um025", "um100", "pm25", "pm10", "um010", "pm1"]
      const units = ['particles/cm³','particles/cm³','µg/m³','µg/m³','particles/cm³','µg/m³']

      let plotData = []

      for (let i=0; i< parameters.length; i++) {
        let location = [];
        let date = [];
        let parameter = [];
        let unit = [];
        let value = [];

        data.forEach((d) => {
          if (d.parameter === parameters[i]){
            location.push(d.location)
            date.push(d.date.utc)
            parameter.push(d.parameter)
            value.push(d.value)
            unit.push(d.unit)

          }
        })
        plotData.push(
          {
            'name': parameters[i] + ' ' + '[' + units[i] + ']', // the legend shows both parameters and their units
            'type': 'bar',
            'x': location,
            'time': date,
            'y': value,
            'unit': unit,
         
          }
        )
      }
      return plotData
    }

    


  
    render() {
      
      // when the data from api hasn't been loaded, an h1 text will show to inform users to wait.
      const  DataisLoaded= this.state.dataFromApiisLoaded; 
        if (!DataisLoaded) return <div>
            <h1> Pleses wait some time.... </h1> </div> ;

      // this variable is the title of the plot, it has the time when the data is queried
      const plotTitle = 'German cities environment measurements at ' + this.state.dataFromApi[0].date.utc;

      /**  
      * the layout for the map contains "metadata" of the plot beside data for the plot
      * width, height: define how big the plot window is
      * title: show title of the plot
      * style: light or dark background of the map
      * ...
     */
      var layoutForMap = {
          title: plotTitle, 
          font: {
            color: 'white'
          },
          width: document.body.clientWidth/1.8,
          height: document.body.clientHeight/1.8,
          dragmode: 'zoom',
          mapbox: {
            center: {
              lat: 50.58411,
              lon: 8.668585
            },
            domain: {
              x: [0, 1],
              y: [0, 1]
            },
            style: 'light',
            zoom: 5
          },
          margin: {
            r: 20,
            t: 40,
            b: 20,
            l: 20,
            pad: 0
          },
          paper_bgcolor: '#191A1A',
          plot_bgcolor: '#191A1A',
          showlegend: true,
          opacity: 0.7,
          annotations: [{
              x: 0,
              y: 0,
              xref: 'paper',
              yref: 'paper',
              text: 'Source: <a href="https://docs.openaq.org/v2/measurements" style="color: rgb(255,255,255)">Environmental Measurements</a>',
              showarrow: false
          }]
        };
        

        var layoutForBar = {
          title: plotTitle,
          barmode: 'stack', // defines the mode of the bar plot (which was already defined in the data)
          width: document.body.clientWidth/1.8,
          height: document.body.clientHeight/1.8,
          
        };
        
        
      return (
        
        <div>
          {console.log(this.state.dataFromApi[0].date.utc)}
          
          <Plot 
            data = {this.transformDataForBarChart(this.state.dataFromApi)}
            layout = {layoutForBar}
          />

          <Plot 
            data = {this.transformDataForMap(this.state.dataFromApi)}
            layout = {layoutForMap}
            // the map box token should be hidden by creating .env file and add this file in the gitignore
            // but for a demo, it can be placed here
            config={{mapboxAccessToken: 'pk.eyJ1IjoidmFuZHVuZ2RvIiwiYSI6ImNsMW5yZ2I3YzBzbW0zY3FyNWNnbXQ3ZnkifQ.WqALjHnOnwCvEWSXhXGumQ'}}
          />  

          
        </div>
      );
    }
}
   
export default Plots;