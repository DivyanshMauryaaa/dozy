import styled from 'styled-components'

export const Button = styled.span<{ active: boolean }>`
  cursor: pointer;
  color: ${props => props.active ? '#000' : '#ccc'};
  padding: 5px;
  margin: 0 3px;
  &:hover { color: #000; }
`