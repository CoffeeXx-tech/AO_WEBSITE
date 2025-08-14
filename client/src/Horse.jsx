export default function Horse({ state, color = 'brown' }) {
  return (
    <mesh position={[state.x, state.y+4, state.z]} rotation={[0, state.yaw, 0]}>
      <boxGeometry args={[1, 1, 2]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}
