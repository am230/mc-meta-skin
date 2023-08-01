import { Group, Object3D, Texture, MeshStandardMaterial, FrontSide, DoubleSide, BoxGeometry, Mesh, Vector2, BufferAttribute, NearestFilter } from 'three'
import * as React from 'react'
import { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import styles from './SkinViewer.module.css'

function setUVs(box: BoxGeometry, u: number, v: number, width: number, height: number, depth: number, textureWidth: number, textureHeight: number): void {
    const toFaceVertices = (x1: number, y1: number, x2: number, y2: number) => [
        new Vector2(x1 / textureWidth, 1.0 - y2 / textureHeight),
        new Vector2(x2 / textureWidth, 1.0 - y2 / textureHeight),
        new Vector2(x2 / textureWidth, 1.0 - y1 / textureHeight),
        new Vector2(x1 / textureWidth, 1.0 - y1 / textureHeight)
    ];

    const top = toFaceVertices(u + depth, v, u + width + depth, v + depth);
    const bottom = toFaceVertices(u + width + depth, v, u + width * 2 + depth, v + depth);
    const left = toFaceVertices(u, v + depth, u + depth, v + depth + height);
    const front = toFaceVertices(u + depth, v + depth, u + width + depth, v + depth + height);
    const right = toFaceVertices(u + width + depth, v + depth, u + width + depth * 2, v + height + depth);
    const back = toFaceVertices(u + width + depth * 2, v + depth, u + width * 2 + depth * 2, v + height + depth);

    const uvAttr = box.attributes.uv as BufferAttribute;
    uvAttr.copyArray(new Float32Array([
        right[3].x, right[3].y, right[2].x, right[2].y, right[0].x, right[0].y, right[1].x, right[1].y,
        left[3].x, left[3].y, left[2].x, left[2].y, left[0].x, left[0].y, left[1].x, left[1].y,
        top[3].x, top[3].y, top[2].x, top[2].y, top[0].x, top[0].y, top[1].x, top[1].y,
        bottom[0].x, bottom[0].y, bottom[1].x, bottom[1].y, bottom[3].x, bottom[3].y, bottom[2].x, bottom[2].y,
        front[3].x, front[3].y, front[2].x, front[2].y, front[0].x, front[0].y, front[1].x, front[1].y,
        back[3].x, back[3].y, back[2].x, back[2].y, back[0].x, back[0].y, back[1].x, back[1].y
    ]));
    uvAttr.needsUpdate = true;
}

function setSkinUVs(box: BoxGeometry, u: number, v: number, width: number, height: number, depth: number): void {
    setUVs(box, u, v, width, height, depth, 64, 64);
}

class BodyPart extends Group {
    constructor(
        readonly innerLayer: Object3D,
        readonly outerLayer: Object3D,
    ) {
        super()
        innerLayer.name = 'innerLayer'
        outerLayer.name = 'outerLayer'
    }
}

type ModelType = "default" | "slim";

export class SkinObject extends Group {

    // body parts
    readonly head: BodyPart;
    readonly body: BodyPart;
    readonly rightArm: BodyPart;
    readonly leftArm: BodyPart;
    readonly rightLeg: BodyPart;
    readonly leftLeg: BodyPart;

    private modelListeners: Array<() => void> = []; // called when model(slim property) is changed
    private slim = false;

    private _map: Texture | null = null;
    private layer1Material: MeshStandardMaterial;
    private layer1MaterialBiased: MeshStandardMaterial;
    private layer2Material: MeshStandardMaterial;
    private layer2MaterialBiased: MeshStandardMaterial;

    constructor() {
        super();

        this.layer1Material = new MeshStandardMaterial({
            side: FrontSide
        });
        this.layer2Material = new MeshStandardMaterial({
            side: DoubleSide,
            transparent: true,
            alphaTest: 1e-5
        });

        this.layer1MaterialBiased = this.layer1Material.clone();
        this.layer1MaterialBiased.polygonOffset = true;
        this.layer1MaterialBiased.polygonOffsetFactor = 1.0;
        this.layer1MaterialBiased.polygonOffsetUnits = 1.0;

        this.layer2MaterialBiased = this.layer2Material.clone();
        this.layer2MaterialBiased.polygonOffset = true;
        this.layer2MaterialBiased.polygonOffsetFactor = 1.0;
        this.layer2MaterialBiased.polygonOffsetUnits = 1.0;

        // Head
        const headBox = new BoxGeometry(8, 8, 8);
        setSkinUVs(headBox, 0, 0, 8, 8, 8);
        const headMesh = new Mesh(headBox, this.layer1Material);

        const head2Box = new BoxGeometry(9, 9, 9);
        setSkinUVs(head2Box, 32, 0, 8, 8, 8);
        const head2Mesh = new Mesh(head2Box, this.layer2Material);

        this.head = new BodyPart(headMesh, head2Mesh);
        this.head.name = "head";
        this.head.add(headMesh, head2Mesh);
        headMesh.position.y = 4;
        head2Mesh.position.y = 4;
        this.add(this.head);

        // Body
        const bodyBox = new BoxGeometry(8, 12, 4);
        setSkinUVs(bodyBox, 16, 16, 8, 12, 4);
        const bodyMesh = new Mesh(bodyBox, this.layer1Material);

        const body2Box = new BoxGeometry(8.5, 12.5, 4.5);
        setSkinUVs(body2Box, 16, 32, 8, 12, 4);
        const body2Mesh = new Mesh(body2Box, this.layer2Material);

        this.body = new BodyPart(bodyMesh, body2Mesh);
        this.body.name = "body";
        this.body.add(bodyMesh, body2Mesh);
        this.body.position.y = -6;
        this.add(this.body);

        // Right Arm
        const rightArmBox = new BoxGeometry();
        const rightArmMesh = new Mesh(rightArmBox, this.layer1MaterialBiased);
        this.modelListeners.push(() => {
            rightArmMesh.scale.x = this.slim ? 3 : 4;
            rightArmMesh.scale.y = 12;
            rightArmMesh.scale.z = 4;
            setSkinUVs(rightArmBox, 40, 16, this.slim ? 3 : 4, 12, 4);
        });

        const rightArm2Box = new BoxGeometry();
        const rightArm2Mesh = new Mesh(rightArm2Box, this.layer2MaterialBiased);
        this.modelListeners.push(() => {
            rightArm2Mesh.scale.x = this.slim ? 3.5 : 4.5;
            rightArm2Mesh.scale.y = 12.5;
            rightArm2Mesh.scale.z = 4.5;
            setSkinUVs(rightArm2Box, 40, 32, this.slim ? 3 : 4, 12, 4);
        });

        const rightArmPivot = new Group();
        rightArmPivot.add(rightArmMesh, rightArm2Mesh);
        this.modelListeners.push(() => {
            rightArmPivot.position.x = this.slim ? -.5 : -1;
        });
        rightArmPivot.position.y = -4;

        this.rightArm = new BodyPart(rightArmMesh, rightArm2Mesh);
        this.rightArm.name = "rightArm";
        this.rightArm.add(rightArmPivot);
        this.rightArm.position.x = -5;
        this.rightArm.position.y = -2;
        this.add(this.rightArm);

        // Left Arm
        const leftArmBox = new BoxGeometry();
        const leftArmMesh = new Mesh(leftArmBox, this.layer1MaterialBiased);
        this.modelListeners.push(() => {
            leftArmMesh.scale.x = this.slim ? 3 : 4;
            leftArmMesh.scale.y = 12;
            leftArmMesh.scale.z = 4;
            setSkinUVs(leftArmBox, 32, 48, this.slim ? 3 : 4, 12, 4);
        });

        const leftArm2Box = new BoxGeometry();
        const leftArm2Mesh = new Mesh(leftArm2Box, this.layer2MaterialBiased);
        this.modelListeners.push(() => {
            leftArm2Mesh.scale.x = this.slim ? 3.5 : 4.5;
            leftArm2Mesh.scale.y = 12.5;
            leftArm2Mesh.scale.z = 4.5;
            setSkinUVs(leftArm2Box, 48, 48, this.slim ? 3 : 4, 12, 4);
        });

        const leftArmPivot = new Group();
        leftArmPivot.add(leftArmMesh, leftArm2Mesh);
        this.modelListeners.push(() => {
            leftArmPivot.position.x = this.slim ? 0.5 : 1;
        });
        leftArmPivot.position.y = -4;

        this.leftArm = new BodyPart(leftArmMesh, leftArm2Mesh);
        this.leftArm.name = "leftArm";
        this.leftArm.add(leftArmPivot);
        this.leftArm.position.x = 5;
        this.leftArm.position.y = -2;
        this.add(this.leftArm);

        // Right Leg
        const rightLegBox = new BoxGeometry(4, 12, 4);
        setSkinUVs(rightLegBox, 0, 16, 4, 12, 4);
        const rightLegMesh = new Mesh(rightLegBox, this.layer1MaterialBiased);

        const rightLeg2Box = new BoxGeometry(4.5, 12.5, 4.5);
        setSkinUVs(rightLeg2Box, 0, 32, 4, 12, 4);
        const rightLeg2Mesh = new Mesh(rightLeg2Box, this.layer2MaterialBiased);

        const rightLegPivot = new Group();
        rightLegPivot.add(rightLegMesh, rightLeg2Mesh);
        rightLegPivot.position.y = -6;

        this.rightLeg = new BodyPart(rightLegMesh, rightLeg2Mesh);
        this.rightLeg.name = "rightLeg";
        this.rightLeg.add(rightLegPivot);
        this.rightLeg.position.x = -1.9;
        this.rightLeg.position.y = -12;
        this.rightLeg.position.z = -.1;
        this.add(this.rightLeg);

        // Left Leg
        const leftLegBox = new BoxGeometry(4, 12, 4);
        setSkinUVs(leftLegBox, 16, 48, 4, 12, 4);
        const leftLegMesh = new Mesh(leftLegBox, this.layer1MaterialBiased);

        const leftLeg2Box = new BoxGeometry(4.5, 12.5, 4.5);
        setSkinUVs(leftLeg2Box, 0, 48, 4, 12, 4);
        const leftLeg2Mesh = new Mesh(leftLeg2Box, this.layer2MaterialBiased);

        const leftLegPivot = new Group();
        leftLegPivot.add(leftLegMesh, leftLeg2Mesh);
        leftLegPivot.position.y = -6;

        this.leftLeg = new BodyPart(leftLegMesh, leftLeg2Mesh);
        this.leftLeg.name = "leftLeg";
        this.leftLeg.add(leftLegPivot);
        this.leftLeg.position.x = 1.9;
        this.leftLeg.position.y = -12;
        this.leftLeg.position.z = -.1;
        this.add(this.leftLeg);

        this.modelType = "default";
    }

    get map(): Texture | null {
        return this._map;
    }

    set map(newMap: Texture | null) {
        this._map = newMap;

        this.layer1Material.map = newMap;
        this.layer1Material.needsUpdate = true;

        this.layer1MaterialBiased.map = newMap;
        this.layer1MaterialBiased.needsUpdate = true;

        this.layer2Material.map = newMap;
        this.layer2Material.needsUpdate = true;

        this.layer2MaterialBiased.map = newMap;
        this.layer2MaterialBiased.needsUpdate = true;
    }

    get modelType(): ModelType {
        return this.slim ? "slim" : "default";
    }

    set modelType(value: ModelType) {
        this.slim = value === "slim";
        this.modelListeners.forEach(listener => listener());
    }

    private getBodyParts(): Array<BodyPart> {
        return this.children.filter(it => it instanceof BodyPart) as Array<BodyPart>;
    }

    setInnerLayerVisible(value: boolean): void {
        this.getBodyParts().forEach(part => part.innerLayer.visible = value);
    }

    setOuterLayerVisible(value: boolean): void {
        this.getBodyParts().forEach(part => part.outerLayer.visible = value);
    }

    resetJoints(): void {
        this.head.rotation.set(0, 0, 0);
        this.leftArm.rotation.set(0, 0, 0);
        this.rightArm.rotation.set(0, 0, 0);
        this.leftLeg.rotation.set(0, 0, 0);
        this.rightLeg.rotation.set(0, 0, 0);
    }
}


const Player = (props: { skinPath: string }) => {
    const texture = useTexture(props.skinPath)
    texture.magFilter = texture.minFilter = NearestFilter
    const skinObject = new SkinObject()
    skinObject.map = texture
    skinObject.modelType = "slim"
    skinObject.setInnerLayerVisible(true)
    skinObject.setOuterLayerVisible(true)
    skinObject.resetJoints()

    skinObject.leftArm.rotation.set(toRadians(45), 0, 0)
    skinObject.rightArm.rotation.set(toRadians(-45), 0, 0)
    skinObject.leftLeg.rotation.set(toRadians(-45 / 2), 0, 0)
    skinObject.rightLeg.rotation.set(toRadians(45 / 2), 0, 0)


    return (
        <primitive object={skinObject} />
    )
}

const toRadians = (degrees: number) => degrees * Math.PI / 180

const SkinViewer = (props: { skinPath: string }) => {
    return (
        <div className={styles.skin_viewer}>
            <Canvas>
                {/* <OrthographicCamera makeDefault zoom={10} position={[0, 10, 10]} rotation={[toRadians(-15), 0, 0]} /> */}
                <PerspectiveCamera makeDefault fov={32} position={[0, 25, 40]} />
                <OrbitControls target={[0, 7 * 5, -25]} position={[0, 0, 25]} enablePan={false} enableZoom={false} dampingFactor={0.2} rotateSpeed={0.5} />
                <ambientLight intensity={0.5} />
                <directionalLight intensity={1.0} rotation={[0, 0, 0]} position={[0, 20, 10]} />
                <mesh position={[0, 7 * 6, -25]} rotation={[0, toRadians(30), 0]}>
                    <Player skinPath={props.skinPath} />
                </mesh>
            </Canvas >
        </div>
    );
};

export default SkinViewer;
