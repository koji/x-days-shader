// Shader loader utility for handling shader files in both dev and production
import vertexShader from '../shaders/vertex.vert'

// Import all shader files statically
import raymarching001 from '../shaders/raymarching001.frag'
import raymarching002 from '../shaders/raymarching002.frag'
import raymarching003 from '../shaders/raymarching003.frag'
import raymarching004 from '../shaders/raymarching004.frag'
import raymarching005 from '../shaders/raymarching005.frag'
import raymarching006 from '../shaders/raymarching006.frag'
import raymarching007 from '../shaders/raymarching007.frag'
import raymarching008 from '../shaders/raymarching008.frag'
import raymarching009 from '../shaders/raymarching009.frag'
import raymarching010 from '../shaders/raymarching010.frag'
import raymarching011 from '../shaders/raymarching011.frag'
import raymarching012 from '../shaders/raymarching012.frag'
import raymarching013 from '../shaders/raymarching013.frag'
import raymarching014 from '../shaders/raymarching014.frag'
import raymarching015 from '../shaders/raymarching015.frag'
import raymarching016 from '../shaders/raymarching016.frag'
import raymarching017 from '../shaders/raymarching017.frag'
import raymarching018 from '../shaders/raymarching018.frag'
import raymarching019 from '../shaders/raymarching019.frag'
import raymarching020 from '../shaders/raymarching020.frag'
import raymarching021 from '../shaders/raymarching021.frag'
import raymarching022 from '../shaders/raymarching022.frag'
import raymarching023 from '../shaders/raymarching023.frag'
import raymarching024 from '../shaders/raymarching024.frag'
import raymarching025 from '../shaders/raymarching025.frag'
import raymarching026 from '../shaders/raymarching026.frag'
import raymarching027 from '../shaders/raymarching027.frag'
import raymarching028 from '../shaders/raymarching028.frag'
import raymarching029 from '../shaders/raymarching029.frag'
import raymarching036 from '../shaders/raymarching036.frag'
import raymarching037 from '../shaders/raymarching037.frag'
import raymarching038 from '../shaders/raymarching038.frag'
import raymarching039 from '../shaders/raymarching039.frag'
import raymarching040 from '../shaders/raymarching040.frag'
import raymarching041 from '../shaders/raymarching041.frag'
import raymarching042 from '../shaders/raymarching042.frag'
import fractal001 from '../shaders/fractal001.frag'
import fractal002 from '../shaders/fractal002.frag'
import fractal003 from '../shaders/fractal003.frag'
import fractal004 from '../shaders/fractal004.frag'
import fractal005 from '../shaders/fractal005.frag'
import fractal006 from '../shaders/fractal006.frag'
import fractal007 from '../shaders/fractal007.frag'
import fractal008 from '../shaders/fractal008.frag'
import colors001 from '../shaders/colors001.frag'
import gradation001 from '../shaders/gradation001.frag'
import gradation002 from '../shaders/gradation002.frag'
import movingBox from '../shaders/movingBox.frag'
import movingOctahedron from '../shaders/movingOctahedron.frag'
import movingpoints001Simple from '../shaders/movingpoints001-simple.frag'
import movingPoints001 from '../shaders/movingPoints001.frag'
import movingPoints002 from '../shaders/movingPoints002.frag'
import movingPoints003 from '../shaders/movingPoints003.frag'
import movingPoints004 from '../shaders/movingPoints004.frag'
import movingPoints005 from '../shaders/movingPoints005.frag'
import movingTetrahedron from '../shaders/movingTetrahedron.frag'
import raymarching035 from '../shaders/raymarching035.frag'
import movingTorus from '../shaders/movingTorus.frag'
import movintOctahedronTorus from '../shaders/movintOctahedronTorus.frag'

// Shader map for static imports
const shaderMap: Record<string, string> = {
  'raymarching001.frag': raymarching001,
  'raymarching002.frag': raymarching002,
  'raymarching003.frag': raymarching003,
  'raymarching004.frag': raymarching004,
  'raymarching005.frag': raymarching005,
  'raymarching006.frag': raymarching006,
  'raymarching007.frag': raymarching007,
  'raymarching008.frag': raymarching008,
  'raymarching009.frag': raymarching009,
  'raymarching010.frag': raymarching010,
  'raymarching011.frag': raymarching011,
  'raymarching012.frag': raymarching012,
  'raymarching013.frag': raymarching013,
  'raymarching014.frag': raymarching014,
  'raymarching015.frag': raymarching015,
  'raymarching016.frag': raymarching016,
  'raymarching017.frag': raymarching017,
  'raymarching018.frag': raymarching018,
  'raymarching019.frag': raymarching019,
  'raymarching020.frag': raymarching020,
  'raymarching021.frag': raymarching021,
  'raymarching022.frag': raymarching022,
  'raymarching023.frag': raymarching023,
  'raymarching024.frag': raymarching024,
  'raymarching025.frag': raymarching025,
  'raymarching026.frag': raymarching026,
  'raymarching027.frag': raymarching027,
  'raymarching028.frag': raymarching028,
  'raymarching029.frag': raymarching029,
  'raymarching036.frag': raymarching036,
  'raymarching037.frag': raymarching037,
  'raymarching038.frag': raymarching038,
  'raymarching039.frag': raymarching039,
  'raymarching040.frag': raymarching040,
  'raymarching041.frag': raymarching041,
  'raymarching042.frag': raymarching042,
  'fractal001.frag': fractal001,
  'fractal002.frag': fractal002,
  'fractal003.frag': fractal003,
  'fractal004.frag': fractal004,
  'fractal005.frag': fractal005,
  'fractal006.frag': fractal006,
  'fractal007.frag': fractal007,
  'fractal008.frag': fractal008,
  'colors001.frag': colors001,
  'gradation001.frag': gradation001,
  'gradation002.frag': gradation002,
  'movingBox.frag': movingBox,
  'movingOctahedron.frag': movingOctahedron,
  'movingpoints001-simple.frag': movingpoints001Simple,
  'movingPoints001.frag': movingPoints001,
  'movingPoints002.frag': movingPoints002,
  'movingPoints003.frag': movingPoints003,
  'movingPoints004.frag': movingPoints004,
  'movingPoints005.frag': movingPoints005,
  'movingTetrahedron.frag': movingTetrahedron,
  'raymarching035.frag': raymarching035,
  'movingTorus.frag': movingTorus,
  'movintOctahedronTorus.frag': movintOctahedronTorus,
}

export const loadShader = async (shaderName: string): Promise<string> => {
  console.log(`Loading shader: ${shaderName}`)

  // Check if we have the shader in our static map
  if (shaderMap[shaderName]) {
    console.log(`Shader ${shaderName} found in static map`)
    const shaderContent = shaderMap[shaderName]

    // Debug: log the first 200 characters of the shader content
    console.log(
      `Shader ${shaderName} content preview:`,
      shaderContent.substring(0, 200)
    )

    // Validate that the content is actually a shader (not HTML)
    if (
      shaderContent.includes('<!DOCTYPE html>') ||
      shaderContent.includes('<html')
    ) {
      console.error(
        `Shader ${shaderName} contains HTML content, this is invalid`
      )
      console.error(`Full content:`, shaderContent)
      throw new Error(`Invalid shader content for ${shaderName}`)
    }

    return shaderContent
  }

  console.log(`Shader ${shaderName} not found in static map, trying fetch...`)

  // Fallback: try to fetch from the server (for development or if shader is missing from map)
  try {
    const response = await fetch(`/shaders/${shaderName}`)
    if (!response.ok) {
      throw new Error(`Failed to load shader: ${response.statusText}`)
    }
    const shaderText = await response.text()

    // Validate that the fetched content is actually a shader
    if (
      shaderText.includes('<!DOCTYPE html>') ||
      shaderText.includes('<html')
    ) {
      throw new Error(`Fetched content is HTML, not a shader`)
    }

    console.log(`Shader ${shaderName} loaded via fetch`)
    return shaderText
  } catch (error) {
    console.error(`Failed to load shader ${shaderName}:`, error)
    // Return a fallback shader
    return `
      uniform float iTime;
      uniform vec3 iResolution;
      uniform vec4 iMouse;
      
      void main() {
        vec2 uv = gl_FragCoord.xy / iResolution.xy;
        vec3 col = 0.5 + 0.5 * cos(iTime + uv.xyx + vec3(0,2,4));
        gl_FragColor = vec4(col, 1.0);
      }
    `
  }
}

export { vertexShader }
