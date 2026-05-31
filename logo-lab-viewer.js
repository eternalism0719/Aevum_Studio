(function () {
  const themeConfig = {
    gallery: {
      title: "Gallery Mode",
      description:
        "White showroom lighting, soft depth, and product-display spacing.",
      clear: 0xf4f7f7,
      ambient: 0xffffff,
      hemiSky: 0xffffff,
      hemiGround: 0xdce5e4,
      key: 0xffffff,
      rim: 0x7befff,
      logo: 0x101214,
      emissive: 0x00181a,
      edge: 0x91f7ff,
      base: 0xe9eeee,
      glass: 0xdafcff,
    },
    observatory: {
      title: "Observatory Mode",
      description:
        "Dark observation room, cyan rim lighting, and a cold orbital lab mood.",
      clear: 0x02060a,
      ambient: 0x112233,
      hemiSky: 0x14334a,
      hemiGround: 0x04070a,
      key: 0x89dcff,
      rim: 0x00f3ff,
      logo: 0x050709,
      emissive: 0x001d26,
      edge: 0x65ddff,
      base: 0x111820,
      glass: 0x66dcff,
    },
  };

  const state = {
    mode: "gallery",
    mouseX: 0,
    mouseY: 0,
    targetMouseX: 0,
    targetMouseY: 0,
    modelLoaded: false,
    isMobile: window.matchMedia("(max-width: 700px)").matches,
  };

  let scene;
  let camera;
  let renderer;
  let container;
  let logoPivot;
  let resizeObserver;
  let animationFrame;

  const lights = {};
  const logoMeshes = [];
  const edgeLines = [];
  const sharedMaterials = {};

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    container = document.getElementById("logo-canvas");
    bindThemeControls();
    initLoader();
    if (container && window.THREE) {
      initScene();
    }
  }

  function initLoader() {
    window.addEventListener("load", () => {
      window.setTimeout(() => {
        document.getElementById("loader")?.classList.add("is-hidden");
      }, 650);
    });
  }

  function initScene() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0.45, state.isMobile ? 7.3 : 6.55);

    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !state.isMobile,
      powerPreference: "high-performance",
    });

    const cap = state.isMobile ? 1.18 : 1.5;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, cap));
    renderer.setClearColor(0x000000, 0);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = false;
    container.appendChild(renderer.domElement);

    logoPivot = new THREE.Group();
    logoPivot.position.set(0, 0.2, 0);
    scene.add(logoPivot);

    createLighting();
    loadEnvironmentOnce();
    loadLogoOnce();
    bindPointer();
    resize();

    if (window.ResizeObserver) {
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(container);
    } else {
      window.addEventListener("resize", resize);
    }

    applyTheme(state.mode);
    animate();
  }

  function createLighting() {
    lights.ambient = new THREE.AmbientLight(0xffffff, 0.5);
    lights.hemi = new THREE.HemisphereLight(0xffffff, 0x0b0b10, 0.58);
    lights.key = new THREE.DirectionalLight(0xffffff, 1.22);
    lights.rim = new THREE.PointLight(0x00f3ff, 2.2, 9);
    lights.floor = new THREE.PointLight(0x7befff, 1.0, 6);

    lights.key.position.set(3.4, 5.2, 4.5);
    lights.rim.position.set(-2.9, 1.7, 2.8);
    lights.floor.position.set(0, -0.95, 1.9);

    scene.add(
      lights.ambient,
      lights.hemi,
      lights.key,
      lights.rim,
      lights.floor,
    );
  }

  function loadEnvironmentOnce() {
    const envSrc = encodeURI(
      container.dataset.envSrc || "3D modeling/base_basic_shaded.glb",
    );
    if (!THREE.GLTFLoader) return;

    const loader = new THREE.GLTFLoader();
    loader.load(envSrc, (gltf) => {
      const envModel = gltf.scene;
      
      envModel.traverse((child) => {
        if (child.isMesh) {
          // Adjust materials slightly if needed to react to our lights
          if (child.material && child.material.isMeshStandardMaterial) {
             child.material.envMapIntensity = 1.0;
          }
        }
      });
      
      scene.add(envModel);
    });
  }

  function loadLogoOnce() {
    const loaderText = container.querySelector(".canvas-loader");
    const modelSrc = encodeURI(
      container.dataset.modelSrc || "3D modeling/3D_Lab_LOGO.glb",
    );

    if (!THREE.GLTFLoader) {
      createFallbackLogo();
      if (loaderText) loaderText.textContent = "GLTF LOADER MISSING";
      return;
    }

    const loader = new THREE.GLTFLoader();
    loader.load(
      modelSrc,
      (gltf) => {
        const model = gltf.scene;
        prepareLogo(model);
        logoPivot.add(model);
        state.modelLoaded = true;
        loaderText?.remove();
        applyTheme(state.mode);
      },
      undefined,
      () => {
        createFallbackLogo();
        if (loaderText) loaderText.textContent = "GLB FALLBACK ACTIVE";
      },
    );
  }

  function prepareLogo(model) {
    const box = new THREE.Box3().setFromObject(model);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    model.position.sub(center);
    const maxAxis = Math.max(size.x, size.y, size.z) || 1;
    model.scale.setScalar((state.isMobile ? 2.15 : 2.35) / maxAxis);

    model.traverse((child) => {
      if (!child.isMesh) return;

      child.material = new THREE.MeshStandardMaterial({
        color: themeConfig[state.mode].logo,
        roughness: 0.3,
        metalness: 0.72,
        emissive: themeConfig[state.mode].emissive,
        emissiveIntensity: 0.36,
      });
      logoMeshes.push(child);

      if (!state.isMobile && child.geometry) {
        const line = new THREE.LineSegments(
          new THREE.EdgesGeometry(child.geometry, 30),
          new THREE.LineBasicMaterial({
            color: themeConfig[state.mode].edge,
            transparent: true,
            opacity: 0.42,
          }),
        );
        child.add(line);
        edgeLines.push(line);
      }
    });
  }

  function createFallbackLogo() {
    const material = new THREE.MeshStandardMaterial({
      color: themeConfig[state.mode].logo,
      roughness: 0.32,
      metalness: 0.72,
      emissive: themeConfig[state.mode].emissive,
      emissiveIntensity: 0.36,
    });

    const group = new THREE.Group();
    const left = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 1.3, 0.18),
      material,
    );
    const right = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 1.3, 0.18),
      material,
    );
    const bridge = new THREE.Mesh(
      new THREE.TorusGeometry(0.56, 0.08, 14, 60, Math.PI),
      material,
    );

    left.position.x = -0.62;
    right.position.x = 0.62;
    bridge.rotation.z = Math.PI;
    bridge.scale.x = 1.36;

    group.add(left, right, bridge);
    logoMeshes.push(left, right, bridge);
    logoPivot.add(group);
    applyTheme(state.mode);
  }

  function bindThemeControls() {
    document
      .querySelectorAll("[data-mode], [data-mode-link]")
      .forEach((control) => {
        control.addEventListener("click", () => {
          const nextMode = control.dataset.mode || control.dataset.modeLink;
          applyTheme(nextMode);
          document
            .getElementById("hero")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      });
  }

  function bindPointer() {
    container.addEventListener("pointermove", (event) => {
      const rect = container.getBoundingClientRect();
      state.targetMouseX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      state.targetMouseY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    });

    container.addEventListener("pointerleave", () => {
      state.targetMouseX = 0;
      state.targetMouseY = 0;
    });
  }

  function applyTheme(mode) {
    state.mode = mode === "observatory" ? "observatory" : "gallery";
    const config = themeConfig[state.mode];

    document.body.dataset.theme = state.mode;
    document.getElementById("mode-title").textContent = config.title;
    document.getElementById("mode-description").textContent =
      config.description;

    document.querySelectorAll(".mode-button").forEach((button) => {
      const active = button.dataset.mode === state.mode;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", String(active));
    });

    document.querySelectorAll(".mode-link").forEach((button) => {
      button.classList.toggle("active", button.dataset.modeLink === state.mode);
    });

    if (!renderer) return;

    renderer.setClearColor(config.clear, 0);

    lights.ambient.color.setHex(config.ambient);
    lights.ambient.intensity = state.mode === "gallery" ? 0.72 : 0.34;
    lights.hemi.color.setHex(config.hemiSky);
    lights.hemi.groundColor.setHex(config.hemiGround);
    lights.hemi.intensity = state.mode === "gallery" ? 0.75 : 0.46;
    lights.key.color.setHex(config.key);
    lights.key.intensity = state.mode === "gallery" ? 1.5 : 1.05;
    lights.rim.color.setHex(config.rim);
    lights.rim.intensity = state.mode === "gallery" ? 1.12 : 2.7;
    lights.floor.color.setHex(config.rim);
    lights.floor.intensity = state.mode === "gallery" ? 0.8 : 1.4;

    logoMeshes.forEach((mesh) => {
      if (!mesh.material) return;
      mesh.material.color.setHex(config.logo);
      mesh.material.emissive.setHex(config.emissive);
      mesh.material.emissiveIntensity = state.mode === "gallery" ? 0.12 : 0.46;
      mesh.material.roughness = state.mode === "gallery" ? 0.34 : 0.24;
      mesh.material.metalness = state.mode === "gallery" ? 0.62 : 0.82;
      mesh.material.needsUpdate = true;
    });

    edgeLines.forEach((line) => {
      line.material.color.setHex(config.edge);
      line.material.opacity = state.mode === "gallery" ? 0.2 : 0.56;
    });
  }

  function resize() {
    if (!container || !renderer || !camera) return;
    const width = Math.max(container.clientWidth, 1);
    const height = Math.max(container.clientHeight, 1);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  }

  function animate(time) {
    animationFrame = window.requestAnimationFrame(animate);

    state.mouseX += (state.targetMouseX - state.mouseX) * 0.06;
    state.mouseY += (state.targetMouseY - state.mouseY) * 0.06;

    const seconds = (time || 0) * 0.001;

    if (logoPivot) {
      logoPivot.rotation.y =
        Math.sin(seconds * 0.48) * 0.09 + state.mouseX * 0.12;
      logoPivot.rotation.x = -state.mouseY * 0.035;
      logoPivot.position.y = 0.2 + Math.sin(seconds * 0.82) * 0.035;
    }

    if (lights.rim) {
      lights.rim.position.x = -2.9 + state.mouseX * 0.85;
      lights.rim.position.y = 1.7 - state.mouseY * 0.5;
    }

    renderer.render(scene, camera);
  }

  window.addEventListener("pagehide", () => {
    if (animationFrame) window.cancelAnimationFrame(animationFrame);
    if (resizeObserver) resizeObserver.disconnect();
  });
})();
