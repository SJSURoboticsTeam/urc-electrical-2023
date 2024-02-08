# Communications Power Board

## Features

- USB-CAN
- Passive PoE (12V)
- USB-A Power (12V)

## Authors

Board Design

- Sofia F

PCB Build

- Shin Umeda

Documentation

- Shin Umeda

## Active Revisions

- Rev A

## Compatibility Notes

N/A

## Summary

The communications power board (often referred to as simply the comm board) is
a passive PoE injector combined with a powered USB plugs. It utilizes a daughter
board buck converter as well as a built-in buck to step down the 40V power from
the USB-CAN to 24V for the PoE and 5V for the USB.

## Functional Block Diagram

```mermaid
block-beta
columns 3
can["USB-CAN"]:3
space:3
buck1["20V Buck"] space buck2["5V Buck"]
space:3
space:2 usb["USB-A"]
RJ1["RJ45"] space RJ2["RJ45"]
can -- "40V"--> buck1
can -- "40V"--> buck2
buck1 -- "24V" --> RJ1
buck2 -- "5V" --> usb
RJ1 -- "ethernet" --> RJ2
RJ2 -- "ethernet" --> RJ1
```

## Typical Application

```mermaid
block-beta
columns 5
tplink space pow["Comm Power"]  space tower
space:5
space device["USB Device"]
tplink -- "Ethernet" --> pow
pow -- "Ethernet" --> tplink
pow -- "PoE Ethernet" --> tower
tower -- "PoE Ethernet" --> pow
pow -- "USB" --> device
```

## Known Issues

- Noticeable coil whine
- Some capacitors are too small, one is too big
- Actually outputs 26V
