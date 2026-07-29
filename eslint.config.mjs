import coreWebVitals from 'eslint-config-next/core-web-vitals'
import typescript from 'eslint-config-next/typescript'

const eslintConfig = [
  // `project/` is the read-only Claude Design handoff bundle, not our source.
  { ignores: ['.next/**', 'node_modules/**', 'project/**'] },
  ...coreWebVitals,
  ...typescript,
]

export default eslintConfig
