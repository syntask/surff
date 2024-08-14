document.addEventListener('DOMContentLoaded', function(){

    let loadStateFlag = false;
    
    const root = document.querySelector(':root');
    // UI stuff

    const softnessInput = document.querySelector('input[name="softness"]');
    const tintInput = document.querySelector('input[name="tint"]');
    const colorSchemeInput = document.querySelector('select[name="color-scheme"]');

    function updateColorScheme(){
        let lightSwatches = document.querySelectorAll('.light-swatch');
        let darkSwatches = document.querySelectorAll('.dark-swatch');
        if (colorSchemeInput.value == 'light'){

            //Light mode
            document.body.classList.remove('sf-dark');

            lightSwatches.forEach(colorSwatch => {
                colorSwatch.classList.remove('collapsed-swatch');
            });

            darkSwatches.forEach(colorSwatch => {
                colorSwatch.classList.add('collapsed-swatch');
            });

        } else if (colorSchemeInput.value == 'dark'){

            //Dark mode
            document.body.classList.add('sf-dark');

            lightSwatches.forEach(colorSwatch => {
                colorSwatch.classList.add('collapsed-swatch');
            });

            darkSwatches.forEach(colorSwatch => {
                colorSwatch.classList.remove('collapsed-swatch');
            });

        } else if (colorSchemeInput.value == 'both'){

            //Both mode
            document.body.classList.add('sf-dark');

            lightSwatches.forEach(colorSwatch => {
                colorSwatch.classList.remove('collapsed-swatch');
            });

            darkSwatches.forEach(colorSwatch => {
                colorSwatch.classList.remove('collapsed-swatch');
            });

        }

    }

    updateColorScheme();

    colorSchemeInput.addEventListener('input', function(){
        updateColorScheme();
    });


    let softness = softnessInput.value;
    let tint = tintInput.value;
    
    

    softnessInput.addEventListener('input', function(){
        softness = softnessInput.value;
        updateColors();
    });

    tintInput.addEventListener('input', function(){
        tint = tintInput.value;
        updateColors();
    });

    const exportCSSButton = document.getElementById('button-export-css');
    exportCSSButton.addEventListener('click', function(){
        // Open the modal
        document.getElementById('export-css-modal-container').classList.remove('hidden');

        // Get the CSS
        let cssString = '';
        for (let key in c) {
            cssString += c[key].cssSelector + ': ' + HSLAtoString(c[key]) + ';\n';
        }
        document.getElementById('css-textarea').value = cssString;

        // add event listener for the copy button
        document.getElementById('button-copy-css').addEventListener('click', function(){
            navigator.clipboard.writeText(cssString);
            // Highlight the textarea
            document.getElementById('css-textarea').select();
        });

        // Add event listener for the close button
        document.getElementById('button-close-export-css-modal').addEventListener('click', function(){
            document.getElementById('export-css-modal-container').classList.add('hidden');
        });
    });

    function initUI(){
        // Create color swatch elements
        const colorSwatches = document.querySelectorAll('.color-swatch');
        colorSwatches.forEach(colorSwatch => {

            // Fetch variables
            const cssVar = colorSwatch.getAttribute('data-color-id');
            const jsVar = cssVar.replace('--sf-', '').replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
            function getCompColor(){
                return getComputedStyle(root).getPropertyValue(cssVar);
            }

            // Construct swatch HTML content
            colorSwatch.innerHTML = `
            <div class="swatch-content-container">
                <div class="color-swatch-label">
                    Color
                </div>
                <div class="swatch-button-container">
                    <div class="swatch-button copy-color-button">
                        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"/></svg>
                    </div>
                    <div class="swatch-button edit-color-button">
                        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
                    </div>
                </div>
            </div>
            `;

            // Add event listeners
            const copyColorButton = colorSwatch.querySelector('.copy-color-button');
            copyColorButton.addEventListener('click', function(){
                navigator.clipboard.writeText(getCompColor());
            });

        });

        refreshUI();
    }

    function refreshUI(){
        // Update color swatch elements
        const colorSwatches = document.querySelectorAll('.color-swatch');
        colorSwatches.forEach(colorSwatch => {

            // Fetch variables
            const cssVar = colorSwatch.getAttribute('data-color-id');
            const jsVar = cssVar.replace('--sf-', '').replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
            function getCompColor(){
                return getComputedStyle(root).getPropertyValue(cssVar).toString();
            }

            function getSafeColor(color){
                // accepts a color string in HSLA format and returns a color string in HSLA format
                // Returns white if the lum is less than 50, black if the lum is greater than 50
                const colorHSLA = stringToHSLA(color);
                if (colorHSLA.l < 70){
                    return 'hsla(0, 0%, 100%, 1)';
                } else {
                    return 'hsla(' + colorHSLA.h + ', ' + colorHSLA.s + '%, '+ Math.min(colorHSLA.l - 50, 100) +'%, 1)';
                }
            }

            // Update swatch color
            colorSwatch.style.backgroundColor = getCompColor();
            colorSwatch.style.color = getSafeColor(getCompColor());

            // Update swatch label
            const colorLabel = colorSwatch.querySelector('.color-swatch-label');
            if (colorLabel){
                colorLabel.textContent = getCompColor();
                //colorLabel.textContent = HSLAstringToHEXAstring(getCompColor());
            }
            
        });
    }

    function initializePickr(){

        const colorSwatches = document.querySelectorAll('.color-swatch');
        colorSwatches.forEach(element => {

            const cssVar = element.getAttribute('data-color-id');
            const jsVar = cssVar.replace('--sf-', '').replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
            function getCompColor(){
                return getComputedStyle(root).getPropertyValue(cssVar);
            }

            const editColorButton = element.querySelector('.edit-color-button');

            const pickr = Pickr.create({
                el: editColorButton,
                useAsButton: true,
                theme: 'classic',
                default: getCompColor(),
                components: {
                    preview: true,
                    hue: true,
                    opacity: true,
    
                    interaction: {
                        hex: true,
                        rgba: true,
                        hsla: true,
                        hsva: true,
                        cmyk: true,
                        input: true,
                        clear: true,
                        save: false
                    }
                }
            });
            pickr.on('show', (colorSelected) => {
                pickr.setColor(getCompColor());
            });
            pickr.on('change', (colorSelected) => {
                pickr.applyColor(colorSelected);
                // if colorSelected is not null
                if (colorSelected) {
                    colorSelectedHSLstring = colorSelected.toHSLA().toString();
                    colorSelectedHSLA = stringToHSLA(colorSelectedHSLstring);
                    overrideColor(jsVar, colorSelectedHSLA);
                }
                
            });
            pickr.on('hide', (colorSelected) => {
                // Hide
            });
            pickr.on('clear', (colorSelected) => {
                resetColor(jsVar);

            });

        });

    }



    // Color stuff
    let c = {};

    async function updateColors(){

        // Helper function to avoid setting a color back to its default value if it has been overridden.
        function setColor(cname, defaults){
            if (!c[cname] || !c[cname].o) {
                c[cname] = { ...defaults };
            }
        }

        setColor('accentLight', { 
            h: 205, 
            s: 100, 
            l: 50, 
            a: 1 
        });

        setColor('accentSecondaryLight', { 
            h: c.accentLight.h, 
            s: c.accentLight.s, 
            l: c.accentLight.l * 1.15, 
            a: c.accentLight.a 
        });

        setColor('accentTertiaryLight', { 
            h: c.accentSecondaryLight.h, 
            s: c.accentSecondaryLight.s, 
            l: c.accentSecondaryLight.l * 1.15, 
            a: c.accentSecondaryLight.a 
        });

        setColor('accentQuaternaryLight', { 
            h: c.accentTertiaryLight.h, 
            s: c.accentTertiaryLight.s, 
            l: c.accentTertiaryLight.l * 1.15, 
            a: c.accentTertiaryLight.a 
        });

        setColor('accentDark', { 
            h: c.accentLight.h, 
            s: c.accentLight.s, 
            l: c.accentLight.l,
            a: c.accentLight.a 
        });

        setColor('accentSecondaryDark', { 
            h: c.accentDark.h, 
            s: c.accentDark.s, 
            l: c.accentDark.l * 0.85, 
            a: c.accentDark.a 
        });

        setColor('accentTertiaryDark', { 
            h: c.accentSecondaryDark.h, 
            s: c.accentSecondaryDark.s, 
            l: c.accentSecondaryDark.l * 0.85, 
            a: c.accentSecondaryDark.a 
        });

        setColor('accentQuaternaryDark', { 
            h: c.accentTertiaryDark.h, 
            s: c.accentTertiaryDark.s, 
            l: c.accentTertiaryDark.l * 0.85, 
            a: c.accentTertiaryDark.a 
        });

        setColor('contrastLight', { 
            h: c.accentLight.h <= 180 ? c.accentLight.h + 180 : c.accentLight.h - 180, // Rotate hue by 180 degrees up or down
            s: c.accentLight.s, 
            l: c.accentLight.l,
            a: c.accentLight.a 
        });

        setColor('contrastSecondaryLight', { 
            h: c.contrastLight.h, 
            s: c.contrastLight.s, 
            l: c.contrastLight.l * 1.15, 
            a: c.contrastLight.a 
        });

        setColor('contrastTertiaryLight', { 
            h: c.contrastSecondaryLight.h, 
            s: c.contrastSecondaryLight.s, 
            l: c.contrastSecondaryLight.l * 1.15, 
            a: c.contrastSecondaryLight.a 
        });

        setColor('contrastQuaternaryLight', { 
            h: c.contrastTertiaryLight.h, 
            s: c.contrastTertiaryLight.s, 
            l: c.contrastTertiaryLight.l * 1.15, 
            a: c.contrastTertiaryLight.a 
        });

        setColor('contrastDark', { 
            h: c.accentDark.h <= 180 ? c.accentDark.h + 180 : c.accentDark.h - 180, // Rotate hue by 180 degrees up or down
            s: c.accentDark.s,
            l: c.accentDark.l,
            a: c.accentDark.a
        });

        setColor('contrastSecondaryDark', { 
            h: c.contrastDark.h, 
            s: c.contrastDark.s, 
            l: c.contrastDark.l * 0.85, 
            a: c.contrastDark.a 
        });

        setColor('contrastTertiaryDark', { 
            h: c.contrastSecondaryDark.h, 
            s: c.contrastSecondaryDark.s, 
            l: c.contrastSecondaryDark.l * 0.85, 
            a: c.contrastSecondaryDark.a 
        });

        setColor('contrastQuaternaryDark', { 
            h: c.contrastTertiaryDark.h, 
            s: c.contrastTertiaryDark.s, 
            l: c.contrastTertiaryDark.l * 0.85, 
            a: c.contrastTertiaryDark.a 
        });

        setColor('backgroundLight', { 
            h: c.accentLight.h, 
            s: c.accentLight.s * (tint / 200), 
            l: 100 - (softness / 10), 
            a: c.accentLight.a 
        });

        setColor('backgroundSecondaryLight', { 
            h: c.backgroundLight.h, 
            s: c.backgroundLight.s, 
            l: c.backgroundLight.l - 5, 
            a: c.backgroundLight.a 
        });

        setColor('backgroundTertiaryLight', { 
            h: c.backgroundSecondaryLight.h, 
            s: c.backgroundSecondaryLight.s, 
            l: c.backgroundSecondaryLight.l - 5, 
            a: c.backgroundSecondaryLight.a 
        });

        setColor('backgroundQuaternaryLight', { 
            h: c.backgroundTertiaryLight.h, 
            s: c.backgroundTertiaryLight.s, 
            l: c.backgroundTertiaryLight.l - 5, 
            a: c.backgroundTertiaryLight.a 
        });

        setColor('backgroundDark', { 
            h: c.accentDark.h, 
            s: c.accentDark.s * (tint / 200), 
            l: 0 + (softness / 10), 
            a: c.accentDark.a 
        });

        setColor('backgroundSecondaryDark', { 
            h: c.backgroundDark.h, 
            s: c.backgroundDark.s, 
            l: c.backgroundDark.l + 5, 
            a: c.backgroundDark.a 
        });

        setColor('backgroundTertiaryDark', { 
            h: c.backgroundSecondaryDark.h, 
            s: c.backgroundSecondaryDark.s, 
            l: c.backgroundSecondaryDark.l + 5, 
            a: c.backgroundSecondaryDark.a 
        });

        setColor('backgroundQuaternaryDark', { 
            h: c.backgroundTertiaryDark.h, 
            s: c.backgroundTertiaryDark.s, 
            l: c.backgroundTertiaryDark.l + 5, 
            a: c.backgroundTertiaryDark.a 
        });

        setColor('foregroundLight', { 
            h: c.accentLight.h, 
            s: c.accentLight.s * (tint / 400), 
            l: (softness / 10), 
            a: c.accentLight.a 
        });

        setColor('foregroundSecondaryLight', { 
            h: c.foregroundLight.h, 
            s: c.foregroundLight.s, 
            l: c.foregroundLight.l + 15, 
            a: c.foregroundLight.a 
        });

        setColor('foregroundTertiaryLight', { 
            h: c.foregroundSecondaryLight.h, 
            s: c.foregroundSecondaryLight.s, 
            l: c.foregroundSecondaryLight.l + 15, 
            a: c.foregroundSecondaryLight.a 
        });

        setColor('foregroundQuaternaryLight', { 
            h: c.foregroundTertiaryLight.h, 
            s: c.foregroundTertiaryLight.s, 
            l: c.foregroundTertiaryLight.l + 15, 
            a: c.foregroundTertiaryLight.a 
        });

        setColor('foregroundDark', { 
            h: c.accentDark.h, 
            s: c.accentDark.s * (tint / 400), 
            l: 100 - (softness / 10), 
            a: c.accentDark.a 
        });

        setColor('foregroundSecondaryDark', { 
            h: c.foregroundDark.h, 
            s: c.foregroundDark.s, 
            l: c.foregroundDark.l - 15, 
            a: c.foregroundDark.a 
        });

        setColor('foregroundTertiaryDark', { 
            h: c.foregroundSecondaryDark.h, 
            s: c.foregroundSecondaryDark.s, 
            l: c.foregroundSecondaryDark.l - 15, 
            a: c.foregroundSecondaryDark.a 
        });

        setColor('foregroundQuaternaryDark', { 
            h: c.foregroundTertiaryDark.h, 
            s: c.foregroundTertiaryDark.s, 
            l: c.foregroundTertiaryDark.l - 15, 
            a: c.foregroundTertiaryDark.a 
        });

        setColor('outlineLight', { 
            h: c.backgroundLight.h,
            s: c.backgroundLight.s * .5,
            l: c.backgroundLight.l - 20,
            a: c.backgroundLight.a
        });

        setColor('outlineSecondaryLight', { 
            h: c.outlineLight.h,
            s: c.outlineLight.s,
            l: c.outlineLight.l - 5,
            a: c.outlineLight.a
        });

        setColor('outlineTertiaryLight', { 
            h: c.outlineSecondaryLight.h,
            s: c.outlineSecondaryLight.s,
            l: c.outlineSecondaryLight.l - 5,
            a: c.outlineSecondaryLight.a
        });

        setColor('outlineQuaternaryLight', { 
            h: c.outlineTertiaryLight.h,
            s: c.outlineTertiaryLight.s,
            l: c.outlineTertiaryLight.l - 5,
            a: c.outlineTertiaryLight.a
        });

        setColor('outlineDark', { 
            h: c.backgroundDark.h,
            s: c.backgroundDark.s * .5,
            l: c.backgroundDark.l + 20,
            a: c.backgroundDark.a
        });

        setColor('outlineSecondaryDark', { 
            h: c.outlineDark.h,
            s: c.outlineDark.s,
            l: c.outlineDark.l + 5,
            a: c.outlineDark.a
        });

        setColor('outlineTertiaryDark', { 
            h: c.outlineSecondaryDark.h,
            s: c.outlineSecondaryDark.s,
            l: c.outlineSecondaryDark.l + 5,
            a: c.outlineSecondaryDark.a
        });

        setColor('outlineQuaternaryDark', { 
            h: c.outlineTertiaryDark.h,
            s: c.outlineTertiaryDark.s,
            l: c.outlineTertiaryDark.l + 5,
            a: c.outlineTertiaryDark.a
        });
        updateCSSVariables();
        refreshUI();
        if (loadStateFlag){
            loadState();
            loadStateFlag = false;
            updateColors();
        }
        saveState();
    }

    function saveState(){
        // Save any overridden colors to the URL query string
        let url = new URL(window.location.href);
        let params = new URLSearchParams(url.search);
        for (let key in c) {
            if (c[key].o) {
                params.set(key, HSLAtoString(c[key]));
            } else {
                params.delete(key);
            }
        }
        params.set('softness', softness);
        params.set('tint', tint);
        params.set('color-scheme', colorSchemeInput.value);
        url.search = params.toString();
        window.history.replaceState({}, '', url);
    }

    function loadState(){
        // Load any overridden colors from the URL query string
        let url = new URL(window.location.href);
        let params = new URLSearchParams(url.search);
        for (let key in c) {
            if (params.has(key)) {
                overrideColor(key, stringToHSLA(params.get(key)));
            }
        }
        if (params.has('softness')) {
            softness = params.get('softness');
            softnessInput.value = softness;
        }
        if (params.has('tint')) {
            tint = params.get('tint');
            tintInput.value = tint;
        }
        if (params.has('color-scheme')) {
            colorSchemeInput.value = params.get('color-scheme');
        }
        updateColorScheme();
    }


    function updateCSSVariables() {
        for (let key in c) {
            let cssSelector = '--sf-' + key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
            c[key].cssSelector = cssSelector;
            root.style.setProperty(cssSelector, HSLAtoString(c[key]));
        }
    }

    // Function to override a color's value. 
    // Example usage: 
    // overrideColor('accentLight', { h: 20 });
    function overrideColor(key, v) {
        if (c[key]) {
            Object.assign(c[key], v); // Assigns the values in v to the object c[key].
            c[key].o = true; // Apply the 'o' flag to indicate that the color has been overridden.
        } else {
            console.error(`Color ${colorName} does not exist.`);
        }
        updateColors();
    }

    // Function to reset a color's value to its default value.
    // Example usage:
    // resetColor('accentLight');
    function resetColor(key) {
        if (c[key]) {
            c[key].o = false; // Remove the 'o' flag to indicate that the color has been reset.
        } else {
            console.error(`Color ${colorName} does not exist.`);
        }
        updateColors();
    }


    // INITIALIZATION CODE
    updateColors();
    initUI();
    initializePickr();

    
});