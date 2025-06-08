import React from 'react'
import styled from 'styled-components'

interface ButtonProps {
  active: boolean
  reversed?: boolean
}

export const Button = styled.span<ButtonProps>`
  cursor: pointer;
  color: ${props => props.active ? 'black' : '#aaa'};
  padding: 5px;
  &:hover {
    color: black;
  }
`

export const Icon = styled.span`
  font-family: 'Material Icons';
  font-size: 18px;
  vertical-align: text-bottom;
`

export const Toolbar = styled.div`
  position: relative;
  padding: 8px;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  gap: 8px;
`