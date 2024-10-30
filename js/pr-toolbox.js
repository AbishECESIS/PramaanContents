let filteredDataSetToolbox = null;
let dataSetToolbox = "";  // Dataset for Toolbox search
let dataSetOrgToolbox = dataSetToolbox;  // Original dataset for Toolbox

const displayItemsToolbox = (dataResSet) => {
    let categoryMap = {};

    // Group categories under their respective titles
    dataResSet.forEach(element => {
        if (!categoryMap[element.cat_title]) {
            categoryMap[element.cat_title] = [];
        }
        categoryMap[element.cat_title].push({
            category: element.category,
            status: element.status
        });
    });

    let html = '';
    for (const [cat_title, categories] of Object.entries(categoryMap)) {
        if (categories.length > 0) {
            html += `<p class="dis-cat-title">${cat_title}</p>`;
            html += `<div class="dis-cat-items-div">`
            categories.forEach(category => {
                html += `<div class="cat-icon-div ${category.status}">
                            <span class="cat-icon"></span>
                            <p class="cat-cnt">${category.category}</p>
                        </div>`;
            });
            html += `</div>`;
        }
    }

    if (html === '') {
        html = `<p>No Records found</p>`;
    }

    document.querySelector('#display-cat-main-div').innerHTML = html;
}

function loadToolboxData() {
    fetch('/json/pramaan_toolbox.json')
        .then(response => response.json())
        .then(data => {
            dataSetToolbox = data;
            dataSetOrgToolbox = dataSetToolbox;
            displayItemsToolbox(dataSetToolbox);
        });
}

// Search functionality for Toolbox section
const processSearchToolbox = () => {
    let dataSet = dataSetOrgToolbox;  // Original Toolbox dataset

    const searchCriteria = {
        search: txtSearch4.value.trim().toLowerCase() ? [txtSearch4.value.trim().toLowerCase()] : []
    };

    if (searchCriteria.search.length) {
        dataSet = filterConditionsToolbox(dataSet, searchCriteria);
    }

    displayItemsToolbox(dataSet);  // Display the filtered Toolbox results
}

const filterConditionsToolbox = (dataset, searchCriteria) => {
    return dataset.filter(d => {
        const matchesSearch = searchCriteria.search.length > 0 
            ? searchCriteria.search.some(term => 
                (d.category?.toLowerCase() || '').includes(term) || 
                (d.status?.toLowerCase() || '').includes(term)
            ) 
            : true;

        return matchesSearch;
    });
}

// Input field selectors for Toolbox search
var txtSearch4 = document.getElementById('cat-search');

txtSearch4.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        processSearchToolbox();
    }
});

loadToolboxData();  // Load Toolbox data on page load

function Clearbtn(){
    var searchInput = document.getElementById('cat-search');
    searchInput.value = "";
    loadToolboxData()
}
