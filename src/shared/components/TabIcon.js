// Simple flat tab icons drawn with Views (no emoji, no icon library). Tinted by the `color` prop.
import React from 'react';
import {StyleSheet, View} from 'react-native';

const SIZE = 22;

function HomeIcon({color}) {
  return (
    <View style={styles.box}>
      <View style={[styles.roof, {borderBottomColor: color}]} />
      <View style={[styles.house, {backgroundColor: color}]} />
    </View>
  );
}

function CartIcon({color}) {
  return (
    <View style={styles.box}>
      <View style={[styles.basket, {backgroundColor: color}]} />
      <View style={styles.wheels}>
        <View style={[styles.wheel, {backgroundColor: color}]} />
        <View style={[styles.wheel, {backgroundColor: color}]} />
      </View>
    </View>
  );
}

function ProfileIcon({color}) {
  return (
    <View style={styles.box}>
      <View style={[styles.head, {backgroundColor: color}]} />
      <View style={[styles.body, {backgroundColor: color}]} />
    </View>
  );
}

export const TAB_ICONS = {Home: HomeIcon, Cart: CartIcon, Profile: ProfileIcon};

const styles = StyleSheet.create({
  box: {
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  roof: {
    width: 0,
    height: 0,
    borderLeftWidth: SIZE / 2,
    borderRightWidth: SIZE / 2,
    borderBottomWidth: SIZE / 2.4,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  house: {
    width: SIZE * 0.64,
    height: SIZE * 0.5,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  basket: {
    width: SIZE * 0.9,
    height: SIZE * 0.5,
    borderRadius: 3,
    marginBottom: 3,
  },
  wheels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: SIZE * 0.7,
  },
  wheel: {width: 5, height: 5, borderRadius: 2.5},
  head: {
    width: SIZE * 0.42,
    height: SIZE * 0.42,
    borderRadius: SIZE * 0.21,
    marginBottom: 2,
  },
  body: {
    width: SIZE * 0.9,
    height: SIZE * 0.42,
    borderTopLeftRadius: SIZE * 0.45,
    borderTopRightRadius: SIZE * 0.45,
  },
});
