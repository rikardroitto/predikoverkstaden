// ============================================================================
// PREDIKOVERKSTADEN – Interaktiv 3D-Scen (Three.js)
// Roterande kyrkbacke snett uppifrån, 6 3D-byggnader, dygnsljus &
// animerad manlig/kvinnlig präst som vandrar mellan platserna.
// ============================================================================

class ParishScene3D {
  constructor(containerId, labelsContainerId, onLocationSelect) {
    this.container = document.getElementById(containerId);
    this.labelsContainer = document.getElementById(labelsContainerId);
    this.onLocationSelect = onLocationSelect;

    this.locationsOrder = [
      "study",         // 0: Arbetsrummet
      "sanctuary",     // 1: Kyrkorummet
      "parish_hall",   // 2: Församlingshemmet
      "town_square",   // 3: Torget & Biblioteket
      "pastoral_care", // 4: Själavård & Besök
      "parsonage"      // 5: Prästgården
    ];

    this.radius = 5.55;
    this.walkRadius = 4.15;
    // Pastorn står på vägen lite till höger om byggnaden så att hen alltid syns fritt
    this.pastorStandAngleOffset = 0.36;
    this.currentLocationId = "study";
    this.avatarGender = "male"; // 'male' | 'female'
    this.timeOfDay = "morning";

    // Rotations- och gångtillstånd
    this.worldRotationY = 0;
    this.targetWorldRotationY = 0;

    // Pastorns position i vinkel runt cirkeln (i worldGroup-koordinater)
    this.pastorAngle = this.pastorStandAngleOffset;
    this.targetPastorAngle = this.pastorStandAngleOffset;
    this.isWalking = false;
    this.walkProgress = 1;
    this.walkDuration = 1.05; // sekunder
    this.walkStartTime = 0;
    this.walkStartAngle = 0;
    this.walkEndAngle = 0;
    this.walkDirection = 1;

    this.buildingMeshes = [];
    this.buildingAnchors = {};
    this.labelElements = {};
    this.windowMaterials = [];
    this.lanternLights = [];

    if (this.container && typeof THREE !== "undefined") {
      this.initThree();
      this.buildWorld();
      this.buildPastorAvatar();
      this.createDOMLabels();
      this.setupInteraction();
      this.setTimeOfDay("morning");
      this.animate();
    }
  }

  getViewportSafeSize() {
    const vw = document.documentElement.clientWidth || window.innerWidth || 760;
    const isMob = vw <= 860;
    const rawW = this.container.clientWidth || (isMob ? vw - 36 : 760);
    const width = isMob ? Math.max(240, Math.min(rawW, vw - 34)) : Math.max(300, rawW);
    const height = this.container.clientHeight || (isMob ? 215 : 430);
    return { width, height, isNarrow: width < 560 };
  }

  initThree() {
    const { width, height, isNarrow } = this.getViewportSafeSize();

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xdce8d6);
    this.scene.fog = new THREE.FogExp2(0xdce8d6, 0.018);

    // Kamera snett uppifrån – inramad så att hela kyrkbacken och bortersta labeln rymmer med god marginal
    this.camera = new THREE.PerspectiveCamera(isNarrow ? 46 : 39, width / height, 0.1, 100);
    if (isNarrow) {
      this.camera.position.set(0, 13.0, 17.2);
    } else {
      this.camera.position.set(0, 11.4, 15.0);
    }
    this.camera.lookAt(0, 0.85, -0.3);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setSize(width, height, false);
    this.renderer.domElement.style.width = "100%";
    this.renderer.domElement.style.height = "100%";
    this.renderer.domElement.style.display = "block";
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.innerHTML = "";
    this.container.appendChild(this.renderer.domElement);

    // Belysning
    this.ambientLight = new THREE.AmbientLight(0xfff8e7, 0.68);
    this.scene.add(this.ambientLight);

    this.hemiLight = new THREE.HemisphereLight(0xffffff, 0x6b705c, 0.35);
    this.scene.add(this.hemiLight);

    this.dirLight = new THREE.DirectionalLight(0xfff1c1, 0.95);
    this.dirLight.position.set(9, 15, 10);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 1024;
    this.dirLight.shadow.mapSize.height = 1024;
    this.dirLight.shadow.camera.near = 2;
    this.dirLight.shadow.camera.far = 35;
    const d = 10;
    this.dirLight.shadow.camera.left = -d;
    this.dirLight.shadow.camera.right = d;
    this.dirLight.shadow.camera.top = d;
    this.dirLight.shadow.camera.bottom = -d;
    this.scene.add(this.dirLight);

    this.worldGroup = new THREE.Group();
    this.scene.add(this.worldGroup);

    this.clock = new THREE.Clock();

    window.addEventListener("resize", () => this.onResize());
    if (typeof ResizeObserver !== "undefined") {
      this.resizeObserver = new ResizeObserver(() => this.onResize());
      this.resizeObserver.observe(this.container);
    }
  }

  onResize() {
    if (!this.container || !this.renderer) return;
    const { width, height, isNarrow } = this.getViewportSafeSize();
    this.camera.fov = isNarrow ? 46 : 39;
    if (isNarrow) {
      this.camera.position.set(0, 13.0, 17.2);
    } else {
      this.camera.position.set(0, 11.4, 15.0);
    }
    this.camera.lookAt(0, 0.85, -0.3);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  // ==========================================================================
  // BYGG 3D-VÄRLDEN: Kyrkbacken, gångvägar, träd, lyktor & de 6 platserna
  // ==========================================================================
  buildWorld() {
    // 1. Rund kyrkbacke-bas (Gräs & stensockel)
    const baseGeo = new THREE.CylinderGeometry(8.5, 8.9, 0.7, 48);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x6c8c5e, roughness: 0.9 });
    const baseMesh = new THREE.Mesh(baseGeo, baseMeshMat(0x6c8c5e));
    baseMesh.position.y = -0.35;
    baseMesh.receiveShadow = true;
    this.worldGroup.add(baseMesh);

    const rimGeo = new THREE.CylinderGeometry(8.7, 9.0, 0.35, 48);
    const rimMesh = new THREE.Mesh(rimGeo, baseMeshMat(0x8d8273));
    rimMesh.position.y = -0.55;
    this.worldGroup.add(rimMesh);

    // 2. Kullerstensbelagd cirkelstig (där pastorn går och stannar precis bredvid husen!)
    const walkRadius = this.walkRadius; // 5.35
    const ringGeo = new THREE.RingGeometry(walkRadius - 0.38, walkRadius + 0.38, 64);
    ringGeo.rotateX(-Math.PI / 2);
    const roadMat = new THREE.MeshStandardMaterial({ color: 0xc8bca8, roughness: 0.95 });
    const ringMesh = new THREE.Mesh(ringGeo, roadMat);
    ringMesh.position.y = 0.02;
    ringMesh.receiveShadow = true;
    this.worldGroup.add(ringMesh);

    // Mittrundel med brunn/träd i centrum
    const centerPlazaGeo = new THREE.CylinderGeometry(1.4, 1.4, 0.05, 32);
    const centerPlaza = new THREE.Mesh(centerPlazaGeo, roadMat);
    centerPlaza.position.y = 0.02;
    centerPlaza.receiveShadow = true;
    this.worldGroup.add(centerPlaza);

    // Stigar från mittrundeln ut till varje byggnad
    for (let i = 0; i < 6; i++) {
      const angle = i * (Math.PI / 3);
      const spokeGeo = new THREE.PlaneGeometry(0.52, this.radius - 0.35);
      spokeGeo.rotateX(-Math.PI / 2);
      const spoke = new THREE.Mesh(spokeGeo, roadMat);
      spoke.position.set(
        Math.sin(angle) * (this.radius * 0.48),
        0.018,
        Math.cos(angle) * (this.radius * 0.48)
      );
      spoke.rotation.y = angle;
      spoke.receiveShadow = true;
      this.worldGroup.add(spoke);
    }

    // Vårdträd (stort gammalt lövträd) i mitten av kyrkbacken
    this.createTree(0, 0, 1.25, "oak");

    // 3. Fönster-material som lyser upp på kvällen
    this.sharedWindowMat = new THREE.MeshStandardMaterial({
      color: 0xfff3b0,
      emissive: 0xffb703,
      emissiveIntensity: 0.25,
      roughness: 0.3
    });
    this.windowMaterials.push(this.sharedWindowMat);

    // 4. Bygg de 6 platserna längs rundeln
    this.locationsOrder.forEach((locId, idx) => {
      const angle = idx * (Math.PI / 3);
      const x = Math.sin(angle) * this.radius;
      const z = Math.cos(angle) * this.radius;

      const group = new THREE.Group();
      group.position.set(x, 0, z);
      // Vänd byggnadens framsida utåt eller mot stigen
      group.rotation.y = angle;
      group.userData = { locationId: locId };

      this.buildSpecificLocationModel(locId, group);

      // Lägg till en gatlykta på vänstra sidan av varje plats
      this.createLantern(group, -1.25, 0, -0.5);

      this.worldGroup.add(group);

      // Spara ankarposition för 3D-labeln (ovanför takåsen/spiran)
      const anchor = new THREE.Object3D();
      anchor.position.set(0, locId === "sanctuary" ? 3.65 : 2.38, 0);
      group.add(anchor);
      this.buildingAnchors[locId] = anchor;

      // Samla alla meshes i gruppen för klick-raycasting
      group.traverse((child) => {
        if (child.isMesh) {
          child.userData.locationId = locId;
          this.buildingMeshes.push(child);
        }
      });
    });

    // Dekorativa träd mellan byggnaderna
    for (let i = 0; i < 6; i++) {
      const midAngle = (i + 0.54) * (Math.PI / 3);
      const tx = Math.sin(midAngle) * 6.55;
      const tz = Math.cos(midAngle) * 6.55;
      this.createTree(tx, tz, 0.82, i % 2 === 0 ? "pine" : "oak");
    }
  }

  buildSpecificLocationModel(locId, group) {
    if (locId === "study") {
      // 📖 ARBETSRUMMET / PASTORSEXPEDITIONEN (Tegelhus med valmat tak & stort skrivbordsfönster)
      const body = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.25, 1.4), baseMeshMat(0x9e473b));
      body.position.y = 0.625;
      body.castShadow = true;
      body.receiveShadow = true;
      group.add(body);

      const roof = new THREE.Mesh(new THREE.ConeGeometry(1.45, 0.85, 4), baseMeshMat(0x3a3238));
      roof.position.y = 1.65;
      roof.rotation.y = Math.PI / 4;
      roof.castShadow = true;
      group.add(roof);

      // Skorsten
      const chimney = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.7, 0.25), baseMeshMat(0x7a342a));
      chimney.position.set(0.45, 1.75, -0.2);
      group.add(chimney);

      // Fönster & dörr (mot insidan och utsidan så det syns från alla vinklar)
      this.addWindowsToBox(group, 1.82, 0.68, 1.42);
    } else if (locId === "sanctuary") {
      // 🕯️ KYRKORUMMET (Vit stenkyrka med koppartak, klocktorn och gyllene kors)
      const nave = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.35, 2.1), baseMeshMat(0xf5f0e6));
      nave.position.y = 0.675;
      nave.castShadow = true;
      nave.receiveShadow = true;
      group.add(nave);

      // Sadeltak i ärgad koppar
      const roofGeo = new THREE.CylinderGeometry(0.02, 1.15, 2.2, 3);
      roofGeo.rotateX(Math.PI / 2);
      const roof = new THREE.Mesh(roofGeo, baseMeshMat(0x3b7a67));
      roof.position.y = 1.62;
      roof.scale.set(1.0, 0.65, 1.0);
      roof.castShadow = true;
      group.add(roof);

      // Klocktorn
      const tower = new THREE.Mesh(new THREE.BoxGeometry(0.88, 2.35, 0.88), baseMeshMat(0xf7f3eb));
      tower.position.set(0, 1.175, -0.75);
      tower.castShadow = true;
      group.add(tower);

      // Tornspira
      const spire = new THREE.Mesh(new THREE.ConeGeometry(0.65, 1.25, 8), baseMeshMat(0x2d5e4e));
      spire.position.set(0, 2.95, -0.75);
      spire.castShadow = true;
      group.add(spire);

      // Förgyllt kors på spiran
      const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.42, 0.08), baseMeshMat(0xf5cb5c));
      crossV.position.set(0, 3.68, -0.75);
      const crossH = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.08, 0.08), baseMeshMat(0xf5cb5c));
      crossH.position.set(0, 3.74, -0.75);
      group.add(crossV, crossH);

      // Kyrkfönster
      for (let zOff of [-0.5, 0.1, 0.65]) {
        const win = new THREE.Mesh(new THREE.BoxGeometry(1.64, 0.55, 0.24), this.sharedWindowMat);
        win.position.set(0, 0.75, zOff);
        group.add(win);
      }
    } else if (locId === "parish_hall") {
      // ☕ FÖRSAMLINGSHEMMET (Faluröd trägård med vita knutar & veranda)
      const hall = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.15, 1.35), baseMeshMat(0x8c2d26));
      hall.position.y = 0.575;
      hall.castShadow = true;
      hall.receiveShadow = true;
      group.add(hall);

      const roof = new THREE.Mesh(new THREE.ConeGeometry(1.5, 0.75, 4), baseMeshMat(0x4a2520));
      roof.position.y = 1.52;
      roof.rotation.y = Math.PI / 4;
      roof.castShadow = true;
      group.add(roof);

      // Vita knutar
      for (let sx of [-0.98, 0.98]) {
        for (let sz of [-0.65, 0.65]) {
          const corner = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.16, 0.08), baseMeshMat(0xfdfbf7));
          corner.position.set(sx, 0.58, sz);
          group.add(corner);
        }
      }
      this.addWindowsToBox(group, 2.02, 0.65, 1.37);
    } else if (locId === "town_square") {
      // 📰 TORGET & BIBLIOTEKET (Klassisk sandstensbyggnad med pelare & kupol)
      const lib = new THREE.Mesh(new THREE.BoxGeometry(1.9, 1.3, 1.45), baseMeshMat(0xd9c5a3));
      lib.position.y = 0.65;
      lib.castShadow = true;
      lib.receiveShadow = true;
      group.add(lib);

      // Tak + klassisk kupol
      const top = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.18, 1.55), baseMeshMat(0x7d7468));
      top.position.y = 1.38;
      group.add(top);

      const dome = new THREE.Mesh(new THREE.SphereGeometry(0.58, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), baseMeshMat(0x4a6b7c));
      dome.position.y = 1.45;
      group.add(dome);

      // Pelare på båda långsidorna
      for (let xOff of [-0.65, -0.22, 0.22, 0.65]) {
        for (let zSide of [-0.76, 0.76]) {
          const col = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 1.25, 10), baseMeshMat(0xf5f0e6));
          col.position.set(xOff, 0.62, zSide);
          group.add(col);
        }
      }
      this.addWindowsToBox(group, 1.92, 0.72, 1.47);
    } else if (locId === "pastoral_care") {
      // 🏥 SJÄLAVÅRD & BESÖK (Varmt gult tvåvåningshus med rött tegeltak)
      const house = new THREE.Mesh(new THREE.BoxGeometry(1.55, 1.45, 1.35), baseMeshMat(0xe0b76b));
      house.position.y = 0.725;
      house.castShadow = true;
      house.receiveShadow = true;
      group.add(house);

      const roof = new THREE.Mesh(new THREE.ConeGeometry(1.3, 0.8, 4), baseMeshMat(0xa8422b));
      roof.position.y = 1.85;
      roof.rotation.y = Math.PI / 4;
      roof.castShadow = true;
      group.add(roof);

      this.addWindowsToBox(group, 1.57, 0.55, 1.37);
      this.addWindowsToBox(group, 1.57, 1.12, 1.37);
    } else if (locId === "parsonage") {
      // 🏠 PRÄSTGÅRDEN (Vit herrgårdsbyggnad vid skogsbrynet)
      const manor = new THREE.Mesh(new THREE.BoxGeometry(1.9, 1.25, 1.4), baseMeshMat(0xf4efe4));
      manor.position.y = 0.625;
      manor.castShadow = true;
      manor.receiveShadow = true;
      group.add(manor);

      const roof = new THREE.Mesh(new THREE.ConeGeometry(1.48, 0.82, 4), baseMeshMat(0x2f3e46));
      roof.position.y = 1.66;
      roof.rotation.y = Math.PI / 4;
      roof.castShadow = true;
      group.add(roof);

      this.addWindowsToBox(group, 1.92, 0.68, 1.42);
      // Liten gran på vänstra sidan av prästgården (så högra sidan är fri för pastorn)
      this.createTreeInGroup(group, -1.35, -0.35, 0.72, "pine");
    }
  }

  addWindowsToBox(group, width, y, depth) {
    for (let xOff of [-0.45, 0.45]) {
      const winZ = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.34, depth + 0.02), this.sharedWindowMat);
      winZ.position.set(xOff, y, 0);
      group.add(winZ);
    }
    const winX = new THREE.Mesh(new THREE.BoxGeometry(width + 0.02, 0.34, 0.32), this.sharedWindowMat);
    winX.position.set(0, y, 0);
    group.add(winX);
  }

  createLantern(parentGroup, x, y, z) {
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 1.05, 8), baseMeshMat(0x222629));
    pole.position.set(x, 0.52, z);
    pole.castShadow = true;
    parentGroup.add(pole);

    const bulbMat = new THREE.MeshStandardMaterial({
      color: 0xffe89e,
      emissive: 0xffaa00,
      emissiveIntensity: 0.4
    });
    this.windowMaterials.push(bulbMat);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 10), bulbMat);
    head.position.set(x, 1.1, z);
    parentGroup.add(head);
  }

  createTree(x, z, scale = 1.0, type = "oak") {
    this.createTreeInGroup(this.worldGroup, x, z, scale, type);
  }

  createTreeInGroup(parent, x, z, scale = 1.0, type = "oak") {
    const tGroup = new THREE.Group();
    tGroup.position.set(x, 0, z);
    tGroup.scale.set(scale, scale, scale);

    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.16, 0.75, 8), baseMeshMat(0x5c4033));
    trunk.position.y = 0.37;
    trunk.castShadow = true;
    tGroup.add(trunk);

    if (type === "pine") {
      const c1 = new THREE.Mesh(new THREE.ConeGeometry(0.65, 1.1, 8), baseMeshMat(0x2d5a3c));
      c1.position.y = 1.0;
      c1.castShadow = true;
      const c2 = new THREE.Mesh(new THREE.ConeGeometry(0.5, 0.9, 8), baseMeshMat(0x3a6b49));
      c2.position.y = 1.55;
      c2.castShadow = true;
      tGroup.add(c1, c2);
    } else {
      const crown = new THREE.Mesh(new THREE.DodecahedronGeometry(0.68, 1), baseMeshMat(0x4a7c59));
      crown.position.y = 1.15;
      crown.castShadow = true;
      tGroup.add(crown);
    }
    parent.add(tGroup);
  }

  // ==========================================================================
  // BYGG PASTORNS 3D-AVATAR (Manlig & Kvinnlig Präst med Gånganimation)
  // ==========================================================================
  buildPastorAvatar() {
    if (this.pastorRoot) {
      this.worldGroup.remove(this.pastorRoot);
    }

    this.pastorRoot = new THREE.Group();
    this.pastorBody = new THREE.Group();
    this.pastorRoot.add(this.pastorBody);

    const blackCloth = baseMeshMat(0x1e1d24);
    const skinMat = baseMeshMat(0xf4c29f);
    const whiteCollarMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
    const shoeMat = baseMeshMat(0x141216);
    const bookMat = baseMeshMat(0x7c2d12);
    const goldMat = baseMeshMat(0xeab308);

    // Vänster & Höger ben (med pivot i höften för gånganimation!)
    this.leftLegPivot = new THREE.Group();
    this.leftLegPivot.position.set(-0.1, 0.42, 0);
    const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 0.38, 10), blackCloth);
    leftLeg.position.y = -0.19;
    leftLeg.castShadow = true;
    const leftShoe = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.07, 0.17), shoeMat);
    leftShoe.position.set(0, -0.37, 0.03);
    this.leftLegPivot.add(leftLeg, leftShoe);

    this.rightLegPivot = new THREE.Group();
    this.rightLegPivot.position.set(0.1, 0.42, 0);
    const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 0.38, 10), blackCloth);
    rightLeg.position.y = -0.19;
    rightLeg.castShadow = true;
    const rightShoe = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.07, 0.17), shoeMat);
    rightShoe.position.set(0, -0.37, 0.03);
    this.rightLegPivot.add(rightLeg, rightShoe);

    this.pastorBody.add(this.leftLegPivot, this.rightLegPivot);

    // Överkropp / Prästdräkt
    if (this.avatarGender === "female") {
      // Kvinnlig präst: Skräddad prästkappa / A-linjekjol + liv
      const skirt = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.25, 0.46, 14), blackCloth);
      skirt.position.y = 0.46;
      skirt.castShadow = true;
      const bodice = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.15, 0.36, 14), blackCloth);
      bodice.position.y = 0.78;
      bodice.castShadow = true;
      this.pastorBody.add(skirt, bodice);
    } else {
      // Manlig präst: Prästkavaj
      const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.16, 0.54, 14), blackCloth);
      torso.position.y = 0.68;
      torso.castShadow = true;
      this.pastorBody.add(torso);
    }

    // Vit prästkrage (framtill i halsen)
    const collarRing = new THREE.Mesh(new THREE.CylinderGeometry(0.115, 0.125, 0.065, 14), blackCloth);
    collarRing.position.y = 0.96;
    const whiteTab = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.055, 0.04), whiteCollarMat);
    whiteTab.position.set(0, 0.96, 0.11);
    this.pastorBody.add(collarRing, whiteTab);

    // Armar (med pivot vid axlarna)
    this.leftArmPivot = new THREE.Group();
    this.leftArmPivot.position.set(-0.22, 0.89, 0);
    const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.045, 0.38, 10), blackCloth);
    leftArm.position.y = -0.17;
    const leftHand = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), skinMat);
    leftHand.position.y = -0.37;
    this.leftArmPivot.add(leftArm, leftHand);

    this.rightArmPivot = new THREE.Group();
    this.rightArmPivot.position.set(0.22, 0.89, 0);
    const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.045, 0.38, 10), blackCloth);
    rightArm.position.y = -0.17;
    const rightHand = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), skinMat);
    rightHand.position.y = -0.37;
    // Liten inbunden bibel med guldkors i höger hand
    const bible = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.14, 0.11), bookMat);
    bible.position.set(0.03, -0.37, 0.04);
    const bCross = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.06, 0.02), goldMat);
    bCross.position.set(0.03, -0.37, 0.04);
    this.rightArmPivot.add(rightArm, rightHand, bible, bCross);

    this.pastorBody.add(this.leftArmPivot, this.rightArmPivot);

    // Huvud & Hår
    this.headGroup = new THREE.Group();
    this.headGroup.position.set(0, 1.15, 0);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.165, 16, 16), skinMat);
    head.castShadow = true;
    this.headGroup.add(head);

    // Ögon
    const eyeMat = baseMeshMat(0x1f1b18);
    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.022, 8, 8), eyeMat);
    eyeL.position.set(-0.055, 0.02, 0.15);
    const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.022, 8, 8), eyeMat);
    eyeR.position.set(0.055, 0.02, 0.15);
    this.headGroup.add(eyeL, eyeR);

    if (this.avatarGender === "female") {
      // Kvinnligt hår: Varm kastanjebrun frisyr med sidolugg och knut/svall
      const hairMat = baseMeshMat(0x6f3b24);
      const hairTop = new THREE.Mesh(new THREE.SphereGeometry(0.176, 16, 14, 0, Math.PI * 2, 0, Math.PI * 0.62), hairMat);
      hairTop.position.y = 0.02;
      hairTop.rotation.x = -0.22;

      const hairBun = new THREE.Mesh(new THREE.SphereGeometry(0.095, 12, 12), hairMat);
      hairBun.position.set(0, 0.03, -0.17);

      const hairSideL = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.22, 8), hairMat);
      hairSideL.position.set(-0.14, -0.07, -0.02);
      const hairSideR = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.22, 8), hairMat);
      hairSideR.position.set(0.14, -0.07, -0.02);

      this.headGroup.add(hairTop, hairBun, hairSideL, hairSideR);
    } else {
      // Manligt hår & kort skägg
      const hairMat = baseMeshMat(0x4a3426);
      const hairCap = new THREE.Mesh(new THREE.SphereGeometry(0.173, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55), hairMat);
      hairCap.position.y = 0.02;
      hairCap.rotation.x = -0.25;
      this.headGroup.add(hairCap);
    }

    this.pastorBody.add(this.headGroup);
    // Skala upp pastorn något så hen syns extra tydligt bredvid byggnaden
    this.pastorBody.scale.set(1.18, 1.18, 1.18);

    this.worldGroup.add(this.pastorRoot);
    this.updatePastorWorldTransform();
  }

  setAvatarGender(gender) {
    this.avatarGender = gender === "female" ? "female" : "male";
    this.buildPastorAvatar();
  }

  // ==========================================================================
  // SVÄVANDE 3D-LABELS INTILL BYGGNADERNA
  // ==========================================================================
  createDOMLabels(customData) {
    if (!this.labelsContainer) return;
    this.labelsContainer.innerHTML = "";
    this.labelElements = {};

    const gameData = customData || window.GAME_DATA;
    this.locationsOrder.forEach((locId) => {
      const loc = gameData.locations.find((l) => l.id === locId);
      if (!loc) return;

      const btn = document.createElement("button");
      btn.className = "scene3d-label" + (locId === this.currentLocationId ? " active-3d-label" : "");
      btn.dataset.loc = locId;
      btn.innerHTML = `<span class="lbl-icon">${loc.icon}</span><span class="lbl-text"><strong>${loc.name}</strong><small>${loc.subtitle}</small></span>`;
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (this.onLocationSelect) this.onLocationSelect(locId);
      });
      this.labelsContainer.appendChild(btn);
      this.labelElements[locId] = btn;
    });
  }

  setupInteraction() {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.renderer.domElement.addEventListener("click", (event) => {
      const rect = this.renderer.domElement.getBoundingClientRect();
      this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.buildingMeshes, true);
      if (intersects.length > 0) {
        const locId = intersects[0].object.userData.locationId;
        if (locId && this.onLocationSelect) {
          this.onLocationSelect(locId);
        }
      }
    });
  }

  // ==========================================================================
  // FLYTTA PASTORN & ROTERA 3D-SCENEN SÅ VALD PLATS ÄR LÄNGST FRAM
  // ==========================================================================
  moveToLocation(locationId, immediate = false) {
    const idx = this.locationsOrder.indexOf(locationId);
    if (idx === -1) return;

    this.currentLocationId = locationId;
    const desiredAngle = idx * (Math.PI / 3);

    // För att platsen med vinkel `desiredAngle` ska hamna längst fram mot kameran (z > 0, angle = 0),
    // ska worldGroup roteras till `-desiredAngle` (via kortaste vinkelväg!).
    const targetRot = -desiredAngle;
    const rotDiff = shortestAngleDiff(this.targetWorldRotationY, targetRot);
    this.targetWorldRotationY = this.targetWorldRotationY + rotDiff;

    // Pastorns målposition längs cirkelstigen: precis bredvid den valda byggnadens högra sida!
    const desiredPastorAngle = desiredAngle + this.pastorStandAngleOffset;
    const angleDiff = shortestAngleDiff(this.pastorAngle, desiredPastorAngle);

    if (immediate || Math.abs(angleDiff) < 0.001) {
      this.worldRotationY = this.targetWorldRotationY;
      this.pastorAngle = desiredPastorAngle;
      this.targetPastorAngle = desiredPastorAngle;
      this.isWalking = false;
      this.updatePastorWorldTransform();
    } else {
      this.walkStartAngle = this.pastorAngle;
      this.walkEndAngle = this.pastorAngle + angleDiff;
      this.targetPastorAngle = this.walkEndAngle;
      this.walkDirection = angleDiff >= 0 ? 1 : -1;
      this.walkStartTime = performance.now() / 1000;
      this.walkDuration = Math.min(1.35, Math.max(0.75, Math.abs(angleDiff) * 0.55));
      this.isWalking = true;
    }

    // Markera aktiv label
    Object.keys(this.labelElements).forEach((k) => {
      this.labelElements[k].classList.toggle("active-3d-label", k === locationId);
    });
  }

  setTimeOfDay(timeKey) {
    this.timeOfDay = timeKey;
    if (!this.scene) return;

    if (timeKey === "morning") {
      this.scene.background.setHex(0xdcebd8);
      this.scene.fog.color.setHex(0xdcebd8);
      this.ambientLight.color.setHex(0xfff8e7);
      this.ambientLight.intensity = 0.72;
      this.dirLight.color.setHex(0xfff1c1);
      this.dirLight.intensity = 0.95;
      this.dirLight.position.set(10, 14, 9);
      this.windowMaterials.forEach((m) => (m.emissiveIntensity = 0.18));
    } else if (timeKey === "afternoon") {
      this.scene.background.setHex(0xeae2c8);
      this.scene.fog.color.setHex(0xeae2c8);
      this.ambientLight.color.setHex(0xffedd5);
      this.ambientLight.intensity = 0.68;
      this.dirLight.color.setHex(0xfbbf24);
      this.dirLight.intensity = 0.95;
      this.dirLight.position.set(-9, 13, 10);
      this.windowMaterials.forEach((m) => (m.emissiveIntensity = 0.3));
    } else if (timeKey === "evening") {
      this.scene.background.setHex(0x1f2238);
      this.scene.fog.color.setHex(0x1f2238);
      this.ambientLight.color.setHex(0x6b7aa1);
      this.ambientLight.intensity = 0.42;
      this.dirLight.color.setHex(0x93c5fd);
      this.dirLight.intensity = 0.45;
      this.dirLight.position.set(-6, 14, 8);
      this.windowMaterials.forEach((m) => (m.emissiveIntensity = 1.15));
    } else if (timeKey === "sunday") {
      this.scene.background.setHex(0xf3e5ab);
      this.scene.fog.color.setHex(0xf3e5ab);
      this.ambientLight.color.setHex(0xfffbeb);
      this.ambientLight.intensity = 0.8;
      this.dirLight.color.setHex(0xfde047);
      this.dirLight.intensity = 1.05;
      this.windowMaterials.forEach((m) => (m.emissiveIntensity = 0.5));
    }
  }

  updatePastorWorldTransform() {
    if (!this.pastorRoot) return;
    const r = this.walkRadius;
    const x = Math.sin(this.pastorAngle) * r;
    const z = Math.cos(this.pastorAngle) * r;
    this.pastorRoot.position.set(x, 0, z);

    if (this.isWalking) {
      // Vänd pastorn längs tangenten i gångriktningen
      const tangentAngle = this.pastorAngle + (this.walkDirection > 0 ? Math.PI / 2 : -Math.PI / 2);
      this.pastorRoot.rotation.y = tangentAngle;
    } else {
      // När pastorn står bredvid den aktiva byggnaden, vänd hen rakt mot kameran!
      this.pastorRoot.rotation.y = this.pastorAngle - this.pastorStandAngleOffset * 0.75;
    }
  }

  // ==========================================================================
  // ANIMATIONSLOOP (60 FPS: Världsrotation, Pastorns gångcykel & 3D-Labels)
  // ==========================================================================
  animate() {
    requestAnimationFrame(() => this.animate());

    const now = performance.now() / 1000;
    const dt = Math.min(0.05, this.clock.getDelta());

    // 1. Mjuk inbromsad rotation av hela kyrkbacken så vald plats hamnar längst fram
    const rotError = this.targetWorldRotationY - this.worldRotationY;
    this.worldRotationY += rotError * Math.min(1, dt * 6.5);
    this.worldGroup.rotation.y = this.worldRotationY;

    // 2. Pastorns gång- eller idle-animation
    if (this.isWalking) {
      const elapsed = now - this.walkStartTime;
      const t = Math.min(1, elapsed / this.walkDuration);
      // Smoothstep-kurva
      const ease = t * t * (3 - 2 * t);
      this.pastorAngle = this.walkStartAngle + (this.walkEndAngle - this.walkStartAngle) * ease;

      // Gångcykel för ben, armar och kropp
      const stride = Math.sin(now * 16) * 0.58;
      this.leftLegPivot.rotation.x = stride;
      this.rightLegPivot.rotation.x = -stride;
      this.leftArmPivot.rotation.x = -stride * 0.7;
      this.rightArmPivot.rotation.x = stride * 0.45;
      this.pastorBody.position.y = Math.abs(Math.sin(now * 16)) * 0.065;
      this.pastorBody.rotation.z = Math.cos(now * 16) * 0.04;

      if (t >= 1) {
        this.isWalking = false;
        this.pastorAngle = this.walkEndAngle;
      }
      this.updatePastorWorldTransform();
    } else if (this.pastorBody) {
      // Mjuk andnings- och idle-rörelse när pastorn står vid byggnaden
      this.leftLegPivot.rotation.x *= 0.85;
      this.rightLegPivot.rotation.x *= 0.85;
      this.leftArmPivot.rotation.x = Math.sin(now * 2.2) * 0.05;
      this.rightArmPivot.rotation.x = -0.18 + Math.cos(now * 2.2) * 0.04;
      this.pastorBody.position.y = Math.sin(now * 2.8) * 0.015;
      this.pastorBody.rotation.z = 0;
      this.headGroup.rotation.y = Math.sin(now * 1.4) * 0.12;
      this.updatePastorWorldTransform();
    }

    // 3. Rendera WebGL-scenen
    this.renderer.render(this.scene, this.camera);

    // 4. Uppdatera 2D-skärmkoordinater för alla 3D-labels
    this.updateLabelsProjection();
  }

  updateLabelsProjection() {
    if (!this.labelsContainer || !this.renderer) return;
    const width = this.renderer.domElement.clientWidth;
    const height = this.renderer.domElement.clientHeight;
    const tempV = new THREE.Vector3();

    this.locationsOrder.forEach((locId) => {
      const anchor = this.buildingAnchors[locId];
      const el = this.labelElements[locId];
      if (!anchor || !el) return;

      anchor.getWorldPosition(tempV);
      const depthZ = tempV.z; // Högre z = närmare kameran längst fram!
      tempV.project(this.camera);

      let x = (tempV.x * 0.5 + 0.5) * width;
      let y = (-(tempV.y * 0.5) + 0.5) * height;

      // Skala och framhäv den plats som är längst fram!
      const isFront = depthZ > 3.6;
      const isMobile = width < 580;
      // För byggnaden längst fram skjuts labeln mjukt åt vänster (-74%) så att den aldrig kommer nära pastorn som står till höger om huset
      const xShiftPct = isFront ? (isMobile ? -66 : -74) : -50;

      // Håll alltid alla labels (inklusive den bortersta) inom synliga ramar med god marginal
      const halfW = (el.offsetWidth || (isMobile ? 96 : 180)) * 0.5;
      const lblH = el.offsetHeight || (isMobile ? 26 : 38);
      const pad = isMobile ? 6 : 10;
      x = Math.max(halfW + pad, Math.min(width - halfW - pad, x));
      y = Math.max(lblH + pad, Math.min(height - pad, y));

      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      // OBS! +100 så att zIndex aldrig blir negativt (vid depthZ = -5.1 blev depthZ*10+50 = -1 och hamnade bakom canvas!)
      el.style.zIndex = Math.max(10, Math.round(depthZ * 10 + 100));
      el.style.opacity = depthZ < -2.2 ? "0.9" : "1";
      const scaleVal = isMobile ? (isFront ? 0.96 : 0.78) : isFront ? 1.04 : 0.88;
      el.style.transform = `translate(${xShiftPct}%, -105%) scale(${scaleVal})`;
    });
  }
}

function baseMeshMat(colorHex) {
  return new THREE.MeshStandardMaterial({
    color: colorHex,
    roughness: 0.78,
    metalness: 0.05
  });
}

function shortestAngleDiff(fromAngle, toAngle) {
  const twoPi = Math.PI * 2;
  let diff = (toAngle - fromAngle) % twoPi;
  if (diff > Math.PI) diff -= twoPi;
  if (diff < -Math.PI) diff += twoPi;
  return diff;
}

window.ParishScene3D = ParishScene3D;
