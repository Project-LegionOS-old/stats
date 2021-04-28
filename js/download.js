var defaultVersion = 'arrow-11.0';
var defaultVariant = 'official';
var supportedVersions = [];
var supportedVariants = [];
var selectedDevice;
var versionSelected;
var variantSelected;

var permalinkDevice = '';

$(document).ready(function () {
    $('.navbar-fixed').hide();
    $('.collapsible').collapsible();
    $('.sidenav').sidenav();

    permalinkDevice = $('#get_device').data('device');
    var selectedDevice = permalinkDevice || localStorage.device;

    if (selectedDevice == null) {
        $('#device-content').load("/empty.html");
    } else {
        setDeviceData(selectedDevice);
        $('#device-content').addClass("scale-transition scale-out");
        loadDevicePage(selectedDevice, variantSelected, versionSelected, supportedVersions, supportedVariants);
    }

    $('body').on('click', '#deviceLabel', function () {
        $('#device-page-back').trigger('click');
        $('#device-content').addClass("scale-transition scale-out");
        selectedDevice = $(this).text();
        if (permalinkDevice != null) {
            localStorage.setItem("device", selectedDevice);
            window.location.href = "/download";
            throw new Error("force reload page");
        }
        setDeviceData(selectedDevice);
        loadDevicePage(selectedDevice, variantSelected, versionSelected, supportedVersions, supportedVariants);
    });

    $('body').on('click', '#select-device', function () {
        $('.sidenav').sidenav('open');
    });

    $('body').on('click', '#reload-device', function () {
        window.location.href = '/download';
    });
});

function setDeviceData(device) {
    supportedVersions = [];
    supportedVariants = [];
    supportedInfo = $('[id="deviceLabel"]:contains("' + device + '")').data('supported');
    getVersions(supportedInfo);
    versionSelected = (localStorage.getItem(device + '_version') == null) ? defaultVersion : localStorage.getItem(device + '_version');
    versionSelected = isStillAvailable(supportedVersions, versionSelected);

    getVariants(supportedInfo, versionSelected);
    variantSelected = (localStorage.getItem(device + '_' + versionSelected + '_variant') == null) ? supportedVariants.includes('community') ? 'community' : 'official' : localStorage.getItem(device + '_' + versionSelected + '_variant');
    variantSelected = isStillAvailable(supportedVariants, variantSelected);

    supportedVersions = JSON.stringify(supportedVersions);
    supportedVariants = JSON.stringify(supportedVariants);
}

function getVersions(supportedInfo) {
    $.each(supportedInfo, function (version, value) {
        supportedVersions.push(version);
    });
}

function getVariants(supportedInfo, version) {
    $.each(supportedInfo, function (verKey, value) {
        if (verKey === version) {
            $.each(value['variants'], function (key, variant) {
                supportedVariants.push(variant);
            })
        }
    });
}

/* Check if the previously selected version/variants are available for the device anymore
   If not then fallback to a default available value
*/
function isStillAvailable(deviceData, prevVal) {
    return (deviceData.includes(prevVal)) ? prevVal : deviceData[0];
}

function loadDevicePage(devicename, deviceVariant, deviceVersion, supportedVersions, supportedVariants) {
    $.ajax({
        url: "/device.php",
        cache: false,
        dataType: "html",
        type: "POST",
        data: {
            device: devicename,
            deviceVariant: deviceVariant,
            deviceVersion: deviceVersion,
            supportedVersions: supportedVersions,
            supportedVariants: supportedVariants
        },
        success: function (data) {
            $('#device-content').html(data);
        },
        complete: function (xhr) {
            if (xhr.status === 200) {
                $('#device-content').removeClass("scale-transition scale-out");
                $('#device-content').addClass("scale-transition");
                $(window).scrollTop(0);

                localStorage.setItem("device", devicename);
                localStorage.setItem(devicename + '_version', deviceVersion);
                localStorage.setItem(devicename + '_' + deviceVersion + '_variant', deviceVariant);
            } else {
                $('#device-content').removeClass("scale-transition scale-out");
                $('#device-content').addClass("scale-transition");
                $('#device-content').load(
                    "/device404.php", {
                    device: devicename,
                    deviceVariant: deviceVariant,
                    deviceVersion: deviceVersion,
                }
                );
            }
        }
    });
}