import React from 'react'
import { Hero, HeroBody, Title, Subtitle } from 'bloomer'

const Banner = props => {
  return (
    <Hero isColor="primary" isSize="Medium" isBold="true">
      <HeroBody>
        <Title isSize={1}>YouTube Audio</Title>
        <Subtitle isSize={4}>Downloads Straight to MP3</Subtitle>
      </HeroBody>
    </Hero>
  )
}
export default Banner