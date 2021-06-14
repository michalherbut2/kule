let stan=true

let scene=new THREE.Scene()
let camera=new THREE.PerspectiveCamera(24, window.innerWidth/window.innerHeight, .1, 1000)

const renderer=new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)

let obraz=document.getElementById("obraz")
obraz.appendChild(renderer.domElement)
renderer.setClearColor (0x123456, 1);
const colorBlue=new THREE.Color("#12a4f6")
const colorYellow=new THREE.Color("#4febab")
const colorWhite=new THREE.Color("#eeeeee")

const light=new THREE.PointLight(colorWhite,1.5)
const light2=new THREE.PointLight(colorWhite, 1)

const lineMaterial = new THREE.LineBasicMaterial( { color: 0x00ffff } );

const licz=()=>{
    x1=sphere1.position.x
    y1=sphere1.position.y
    z1=sphere1.position.z
    x2=sphere2.position.x
    y2=sphere2.position.y
    z2=sphere2.position.z
    let OS=Math.sqrt((x2-x1)**2 + (y2-y1)**2 + (z2-z1)**2)
    let R,r
    r1=sphere1.geometry.parameters.radius
    r2=sphere2.geometry.parameters.radius
    R=r1>r2?+r1:+r2
    r=r1<r2?+r1:+r2
    wynik.innerHTML=OS===R+r?"Kule sytczne zewnętrznie":(OS===R-r)?"Kule styczne wewnętrznie":(R-r<OS && OS<R+r)?"Kule przecinające się":(OS>R+r)?"Kule rozłączne zewnętrznie":(OS<R-r)?"Kule rozłączne wewnętrznie":"nic"
}

const renderuj=()=>{
    scene=new THREE.Scene()

    const pointsx = [];
    pointsx.push( new THREE.Vector3( -10, 0, 0 ) );
    pointsx.push( new THREE.Vector3( 10, 0, 0 ) );

    const pointsy = [];
    pointsy.push( new THREE.Vector3( 0, -10, 0 ) );
    pointsy.push( new THREE.Vector3( 0, 10, 0 ) );

    const pointsz = [];
    pointsz.push( new THREE.Vector3( 0, 0, -10 ) );
    pointsz.push( new THREE.Vector3( 0, 0, 10 ) );

    const lineGeometry1 = new THREE.BufferGeometry().setFromPoints( pointsx );
    const lineGeometry2 = new THREE.BufferGeometry().setFromPoints( pointsy );
    const lineGeometry3 = new THREE.BufferGeometry().setFromPoints( pointsz );

    const line1 = new THREE.Line( lineGeometry1, lineMaterial );
    const line2 = new THREE.Line( lineGeometry2, lineMaterial );
    const line3 = new THREE.Line( lineGeometry3, lineMaterial );

    scene.add( line1 );
    scene.add( line2 );
    scene.add( line3 );

    const sphereGeometry1 = new THREE.SphereGeometry( 1, 32, 32 );
    const sphereGeometry2 = new THREE.SphereGeometry( 2, 32, 32 );

    const sphereMaterial1 = new THREE.MeshPhongMaterial({
    color: colorYellow,
    opacity: 0.7,
    transparent: true,
    shininess:10
    } );
    const sphereMaterial2 = new THREE.MeshPhongMaterial({
    color: colorBlue,
    opacity: 0.7,
    transparent: true,
    shininess:10
    } );
    const sphere1 = new THREE.Mesh( sphereGeometry1, sphereMaterial1 );
    const sphere2 = new THREE.Mesh( sphereGeometry2, sphereMaterial2 );

    sphere1.position.set(0,0,0)
    sphere2.position.set(4,0,0)

    light.position.set(-20,20,40)
    light2.position.set(20,-20,-40)

    scene.add(light)
    scene.add(light2)
    scene.add(sphere1);
    scene.add(sphere2);

    camera.position.z=50
    if(!stan) renderer.render(scene, camera)

    return [sphere1,sphere2]
}

controls=new THREE.OrbitControls(camera, renderer.domElement)
controls.enabled=!controls.enabled
const spheres=renderuj()
const sphere1=spheres[0]
const sphere2=spheres[1]
sphere1.name="sphere1"
sphere2.name="sphere2"

let guis=[]
const createGui=s=>{
    guis.push(new dat.GUI())
    guis[guis.length-1].domElement.id = `gui${guis.length}`;
    const sphereFolder = guis[guis.length-1].addFolder(s.name)
    sphereFolder.add(s.position, "x", -10, 10, 0.01)
    sphereFolder.add(s.position, "y", -10, 10, 0.01)
    sphereFolder.add(s.position, "z", -10, 10, 0.01)
    sphereFolder.add(s.geometry.parameters, "radius", 0, 10, 0.01)

    sphereFolder.open()
}
createGui(sphere1)
createGui(sphere2)

const loop=()=>{
    renderer.render(scene, camera)
    licz()
    window.requestAnimationFrame(loop)
}
window.requestAnimationFrame(loop)

setInterval(()=>skaluj(),500)

const skaluj=()=>{
    x1=sphere1.geometry.parameters.radius
    sphere1.scale.set(x1,x1,x1)
    x2=sphere2.geometry.parameters.radius/2
    sphere2.scale.set(x2,x2,x2)
}

window.addEventListener("keydown",(e)=>{
    if(e.key=="o") zmien()
})

const zmien=()=>{
    controls.enabled=!controls.enabled
    loop()
    document.getElementById("obracaj").style.backgroundColor=!controls.enabled?"red":"green"
}

document.getElementById("obracaj").addEventListener('click',zmien)

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}

window.addEventListener('resize', onWindowResize);