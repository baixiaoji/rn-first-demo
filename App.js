import React from "react";
import {
  StyleSheet,
  Text,
  Platform,
  KeyboardAvoidingView,
  ImageBackground,
  View,
  StatusBar,
  ActivityIndicator,
} from "react-native";

import { fetchLocationId, fetchWeather } from "./utils/api";
import getImageForWeather from "./utils/getImageForWeather";

import SearchInput from "./components/SearchInput";

export default class App extends React.Component {
  state = {
    loading: false,
    error: false,
    location: "",
    temperature: 0,
    weather: "",
  };

  componentDidMount() {
    this.handleUpdateLocation("HangZhou");
  }

  handleUpdateLocation = async (city) => {
    if (!city) return;

    this.setState({ loading: true }, async () => {
      try {
        const locationId = await fetchLocationId(city);
        const { location, weather, temperature } = await fetchWeather(
          locationId
        );
        this.setState({
          loading: false,
          error: false,
          location,
          weather,
          temperature,
        });
      } catch (error) {
        this.setState({
          loading: false,
          error: true,
        });
      }
    });
  };

  renderErrorContent() {
    const { error, location } = this.state;

    return (
      error && (
        <Text style={[styles.smallText, styles.textStyle]}>
          Could not load {location} weather, please try a different cify
        </Text>
      )
    );
  }

  renderWeatherInfo() {
    const { location, temperature, weather, error } = this.state;

    return (
      !error && (
        <View>
          <Text style={[styles.largeText, styles.textStyle]}>{location}</Text>
          <Text style={[styles.smallText, styles.textStyle]}>{weather}</Text>
          <Text style={[styles.largeText, styles.textStyle]}>
            {temperature}℃
          </Text>
        </View>
      )
    );
  }
  render() {
    const { weather, loading } = this.state;
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <StatusBar barStyle="light-content" />
        <ImageBackground
          source={getImageForWeather(weather)}
          style={styles.imageContainer}
          imageStyle={styles.image}
        >
          <View style={styles.detailContainer}>
            <ActivityIndicator animating={loading} color="white" size="large" />
            {!loading && (
              <View>
                {this.renderErrorContent()}
                {this.renderWeatherInfo()}
                <SearchInput
                  placeholder="search any City"
                  onSubmit={this.handleUpdateLocation}
                />
              </View>
            )}
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#34495E",
  },
  imageContainer: {
    flex: 1,
  },
  image: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: "cover",
  },
  detailContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
    paddingHorizontal: 20,
  },
  textStyle: {
    textAlign: "center",
    fontFamily: Platform.OS === "ios" ? "AvenirNext-Regular" : "Roboto",
    color: "white",
  },
  largeText: {
    fontSize: 44,
  },
  smallText: {
    fontSize: 18,
  },
});
