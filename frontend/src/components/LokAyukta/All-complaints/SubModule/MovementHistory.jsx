import React from "react";
import Cookies from "js-cookie";
const MovementHistory = ({ complaint }) => {
  const actions = complaint?.actions || [];
  const finalItems = actions.length > 0 ? actions : [{ remarks: "उपलब्ध नहीं" }];

  // Role + Name formatter
  const label = (role, name) => (name ? `${name} (${role})` : role);

  const getMovementTitle = (item) => {
        if (
  complaint?.status === "Final Disposal/Closed" &&
  item?.status === "Final Decision" 
  // &&
  // item?.forward_by_lokayukt !== undefined &&
  // item?.forward_by_lokayukt !== null
) {
  if (item.sent_through_rk === 1) {
    return "Hon’ble Lokayukt → Record Section (RC) → Disposed";
  }
  return "Hon’ble Lokayukt → Disposed";
}

    const record = "Received";

    // FROM
    const rk = label("RK", item.forward_by_rk_name);
    const lok = label("Lokayukt", item.forward_by_lokayukt_name);
    const uplok = label("UpLokayukt", item.forward_by_uplokayukt_name);
    const ps = label("PS", item.forward_by_ps_name);
    const roAro = label("ARO", item.forward_by_ro_aro_name);
    const ro = label("RO", item.forward_by_ro_name);
    const cio = label("CIO", item.forward_by_cio_io_name);
    const io = label("IO", item.forward_by_io_name);
    const sec = label("Secretary", item.forward_by_sec_name);
    const js = label("JS", item.forward_by_js_name); 
    const us = label("US", item.forward_by_us_name);
    const ds = label("DS", item.forward_by_ds_name);
    const so = label("SO", item.forward_by_so_name);
    const pro = label("PRO", item.forward_by_pro_name);
    const aps = label("APS", item.forward_by_aps_name);
    const st = label("ST", item.forward_by_st_name);
    const ac = label("AC", item.forward_by_ac_name);
    // const dispatch = label("AC", item.forward_by_ac_dispatch_name);
    const dispatch = label("Dispatch", item.forward_by_dispatch_name);

    // TO
    const toRK = label("RK", item.forward_to_rk_name);
    const toLok = label("Lokayukt", item.forward_to_lokayukt_name);
    const toUpLok = label("UpLokayukt", item.forward_to_uplokayukt_name);
    const toSec = label("Secretary", item.forward_to_sec_name);
    const toCio = label("CIO", item.forward_to_cio_io_name);
    const toio = label("IO", item.forward_to_io_name);
    const toRoAro = label("ARO", item.forward_to_ro_aro_name);
    const toRo = label("RO", item.forward_to_ro_name);
    const toJs = label("JS", item.forward_to_js_name);
    const toUs = label("US", item.forward_to_us_name);
    const toDs = label("DS", item.forward_to_ds_name);
    const toDispatch = label("Dispatch", item.forward_to_dispatch_name);
    const toPs = label("PS", item.forward_to_ps_name);
    const toSo = label("SO", item.forward_to_so_name);
    const toPro = label("PRO", item.forward_to_pro_name);
    const toAps = label("APS", item.forward_to_aps_name);
    const toSt = label("ST", item.forward_to_st_name);
    const toAc = label("AC", item.forward_to_ac_name);

    /* ================= RK ================= */
  // if (item.forward_by_rk && !item.forward_to_lokayukt) {
    //   return `${record} → Record Section (RC)`;
    // }
    if (item.forward_by_rk && item.sent_through_rk === 1 && item.forward_to_lokayukt) { return `${rk} → Record Section (RC) → Hon’ble ${toLok}`; }
    if (item.forward_by_rk && item.forward_to_lokayukt) { return `${rk} → Hon’ble ${toLok}`; }

    if (item.forward_by_rk && item.sent_through_rk === 1 && item.forward_to_uplokayukt) { return `${rk} → Record Section (RC) → Hon’ble ${toUpLok}`; }
    if (item.forward_by_rk && item.forward_to_uplokayukt) { return `${rk} → Hon’ble ${toUpLok}`; }

    if (item.forward_by_rk && item.sent_through_rk === 1 && item.forward_to_sec) { return `${rk} → Record Section (RC) → ${toSec}`; }
    if (item.forward_by_rk && item.forward_to_sec) { return `${rk} → ${toSec}`; }

    if (item.forward_by_rk && item.sent_through_rk === 1 && item.forward_to_ps) { return `${rk} → Record Section (RC) → ${toPs}`; }
    if (item.forward_by_rk && item.forward_to_ps) { return `${rk} → ${toPs}`; }

    if (item.forward_by_rk && item.sent_through_rk === 1 && item.forward_to_cio_io) { return `${rk} → Record Section (RC) → ${toCio}`; }
    if (item.forward_by_rk && item.forward_to_cio_io) { return `${rk} → ${toCio}`; }

    if (item.forward_by_rk && item.sent_through_rk === 1 && item.forward_to_io) { return `${rk} → Record Section (RC) → ${toio}`; }
    if (item.forward_by_rk && item.forward_to_io) { return `${rk} → ${toio}`; }

    if (item.forward_by_rk && item.sent_through_rk === 1 && item.forward_to_ro_aro) { return `${rk} → Record Section (RC) → ${toRoAro}`; }
    if (item.forward_by_rk && item.forward_to_ro_aro) { return `${rk} → ${toRoAro}`; }

    if (item.forward_by_rk && item.sent_through_rk === 1 && item.forward_to_ro) { return `${rk} → Record Section (RC) → ${toRo}`; }
    if (item.forward_by_rk && item.forward_to_ro) { return `${rk} → ${toRo}`; }

    if (item.forward_by_rk && item.sent_through_rk === 1 && item.forward_to_js) { return `${rk} → Record Section (RC) → ${toJs}`; }
    if (item.forward_by_rk && item.forward_to_js) { return `${rk} → ${toJs}`; }

    if (item.forward_by_rk && item.sent_through_rk === 1 && item.forward_to_us) { return `${rk} → Record Section (RC) → ${toUs}`; }
    if (item.forward_by_rk && item.forward_to_us) { return `${rk} → ${toUs}`; }

    if (item.forward_by_rk && item.sent_through_rk === 1 && item.forward_to_ds) { return `${rk} → Record Section (RC) → ${toDs}`; }
    if (item.forward_by_rk && item.forward_to_ds) { return `${rk} → ${toDs}`; }

    if (item.forward_by_rk && item.sent_through_rk === 1 && item.forward_to_dispatch) { return `${rk} → Record Section (RC) → ${toDispatch}`; }
    if (item.forward_by_rk && item.forward_to_dispatch) { return `${rk} → ${toDispatch}`; }

    if (item.forward_by_rk && item.sent_through_rk === 1 && item.forward_to_so) { return `${rk} → Record Section (RC) → ${toSo}`; }
    if (item.forward_by_rk && item.forward_to_so) { return `${rk} → ${toSo}`; }

    if (item.forward_by_rk && item.sent_through_rk === 1 && item.forward_to_pro) { return `${rk} → Record Section (RC) → ${toPro}`; }
    if (item.forward_by_rk && item.forward_to_pro) { return `${rk} → ${toPro}`; }

    if (item.forward_by_rk && item.sent_through_rk === 1 && item.forward_to_aps) { return `${rk} → Record Section (RC) → ${toAps}`; }
    if (item.forward_by_rk && item.forward_to_aps) { return `${rk} → ${toAps}`; }

    if (item.forward_by_rk && item.sent_through_rk === 1 && item.forward_to_st) { return `${rk} → Record Section (RC) → ${toSt}`; }
    if (item.forward_by_rk && item.forward_to_st) { return `${rk} → ${toSt}`; }

    if (item.forward_by_rk && item.sent_through_rk === 1 && item.forward_to_ac) { return `${rk} → Record Section (RC) → ${toAc}`; }
    if (item.forward_by_rk && item.forward_to_ac) { return `${rk} → ${toAc}`; }

    /* ================= LOKAYUKT ================= */
    if (item.forward_by_lokayukt && item.sent_through_rk === 1 && item.forward_to_lokayukt) { return `Hon’ble ${lok} → Record Section (RC) → Hon’ble ${toLok}`; }
    if (item.forward_by_lokayukt && item.forward_to_lokayukt) { return `Hon’ble ${lok} → Hon’ble ${toLok}`; }

    if (item.forward_by_lokayukt && item.sent_through_rk === 1 && item.forward_to_uplokayukt) { return `Hon’ble ${lok} → Record Section (RC) → Hon’ble ${toUpLok}`; }
    if (item.forward_by_lokayukt && item.forward_to_uplokayukt) { return `Hon’ble ${lok} → Hon’ble ${toUpLok}`; }

    if (item.forward_by_lokayukt && item.sent_through_rk === 1 && item.forward_to_sec) { return `Hon’ble ${lok} → Record Section (RC) → ${toSec}`; }
    if (item.forward_by_lokayukt && item.forward_to_sec) { return `Hon’ble ${lok} → ${toSec}`; }

    if (item.forward_by_lokayukt && item.sent_through_rk === 1 && item.forward_to_ps) { return `Hon’ble ${lok} → Record Section (RC) → ${toPs}`; }
    if (item.forward_by_lokayukt && item.forward_to_ps) { return `Hon’ble ${lok} → ${toPs}`; }

    if (item.forward_by_lokayukt && item.sent_through_rk === 1 && item.forward_to_cio_io) { return `Hon’ble ${lok} → Record Section (RC) → ${toCio}`; }
    if (item.forward_by_lokayukt && item.forward_to_cio_io) { return `Hon’ble ${lok} → ${toCio}`; }

    if (item.forward_by_lokayukt && item.sent_through_rk === 1 && item.forward_to_io) { return `Hon’ble ${lok} → Record Section (RC) → ${toio}`; }
    if (item.forward_by_lokayukt && item.forward_to_io) { return `Hon’ble ${lok} → ${toio}`; }

    if (item.forward_by_lokayukt && item.sent_through_rk === 1 && item.forward_to_ro_aro) { return `Hon’ble ${lok} → Record Section (RC) → ${toRoAro}`; }
    if (item.forward_by_lokayukt && item.forward_to_ro_aro) { return `Hon’ble ${lok} → ${toRoAro}`; }

    if (item.forward_by_lokayukt && item.sent_through_rk === 1 && item.forward_to_ro) { return `Hon’ble ${lok} → Record Section (RC) → ${toRo}`; }
    if (item.forward_by_lokayukt && item.forward_to_ro) { return `Hon’ble ${lok} → ${toRo}`; }

    if (item.forward_by_lokayukt && item.sent_through_rk === 1 && item.forward_to_js) { return `Hon’ble ${lok} → Record Section (RC) → ${toJs}`; }
    if (item.forward_by_lokayukt && item.forward_to_js) { return `Hon’ble ${lok} → ${toJs}`; }

    if (item.forward_by_lokayukt && item.sent_through_rk === 1 && item.forward_to_us) { return `Hon’ble ${lok} → Record Section (RC) → ${toUs}`; }
    if (item.forward_by_lokayukt && item.forward_to_us) { return `Hon’ble ${lok} → ${toUs}`; }

    if (item.forward_by_lokayukt && item.sent_through_rk === 1 && item.forward_to_ds) { return `Hon’ble ${lok} → Record Section (RC) → ${toDs}`; }
    if (item.forward_by_lokayukt && item.forward_to_ds) { return `Hon’ble ${lok} → ${toDs}`; }

    if (item.forward_by_lokayukt && item.sent_through_rk === 1 && item.forward_to_dispatch) { return `Hon’ble ${lok} → Record Section (RC) → ${toDispatch}`; }
    if (item.forward_by_lokayukt && item.forward_to_dispatch) { return `Hon’ble ${lok} → ${toDispatch}`; }

    if (item.forward_by_lokayukt && item.sent_through_rk === 1 && item.forward_to_so) { return `Hon’ble ${lok} → Record Section (RC) → ${toSo}`; }
    if (item.forward_by_lokayukt && item.forward_to_so) { return `Hon’ble ${lok} → ${toSo}`; }

    if (item.forward_by_lokayukt && item.sent_through_rk === 1 && item.forward_to_pro) { return `Hon’ble ${lok} → Record Section (RC) → ${toPro}`; }
    if (item.forward_by_lokayukt && item.forward_to_pro) { return `Hon’ble ${lok} → ${toPro}`; }

    if (item.forward_by_lokayukt && item.sent_through_rk === 1 && item.forward_to_aps) { return `Hon’ble ${lok} → Record Section (RC) → ${toAps}`; }
    if (item.forward_by_lokayukt && item.forward_to_aps) { return `Hon’ble ${lok} → ${toAps}`; }

    if (item.forward_by_lokayukt && item.sent_through_rk === 1 && item.forward_to_st) { return `Hon’ble ${lok} → Record Section (RC) → ${toSt}`; }
    if (item.forward_by_lokayukt && item.forward_to_st) { return `Hon’ble ${lok} → ${toSt}`; }

    if (item.forward_by_lokayukt && item.sent_through_rk === 1 && item.forward_to_ac) { return `Hon’ble ${lok} → Record Section (RC) → ${toAc}`; }
    if (item.forward_by_lokayukt && item.forward_to_ac) { return `Hon’ble ${lok} → ${toAc}`; }

    /* ================= UPLOKAYUKT ================= */
    if (item.forward_by_uplokayukt && item.sent_through_rk === 1 && item.forward_to_lokayukt) { return `Hon’ble ${uplok} → Record Section (RC) → Hon’ble ${toLok}`; }
    if (item.forward_by_uplokayukt && item.forward_to_lokayukt) { return `Hon’ble ${uplok} → Hon’ble ${toLok}`; }

    if (item.forward_by_uplokayukt && item.sent_through_rk === 1 && item.forward_to_uplokayukt) { return `Hon’ble ${uplok} → Record Section (RC) → Hon’ble ${toUpLok}`; }
    if (item.forward_by_uplokayukt && item.forward_to_uplokayukt) { return `Hon’ble ${uplok} → Hon’ble ${toUpLok}`; }

    if (item.forward_by_uplokayukt && item.sent_through_rk === 1 && item.forward_to_sec) { return `Hon’ble ${uplok} → Record Section (RC) → ${toSec}`; }
    if (item.forward_by_uplokayukt && item.forward_to_sec) { return `Hon’ble ${uplok} → ${toSec}`; }

    if (item.forward_by_uplokayukt && item.sent_through_rk === 1 && item.forward_to_ps) { return `Hon’ble ${uplok} → Record Section (RC) → ${toPs}`; }
    if (item.forward_by_uplokayukt && item.forward_to_ps) { return `Hon’ble ${uplok} → ${toPs}`; }

    if (item.forward_by_uplokayukt && item.sent_through_rk === 1 && item.forward_to_cio_io) { return `Hon’ble ${uplok} → Record Section (RC) → ${toCio}`; }
    if (item.forward_by_uplokayukt && item.forward_to_cio_io) { return `Hon’ble ${uplok} → ${toCio}`; }

    if (item.forward_by_uplokayukt && item.sent_through_rk === 1 && item.forward_to_io) { return `Hon’ble ${uplok} → Record Section (RC) → ${toio}`; }
    if (item.forward_by_uplokayukt && item.forward_to_io) { return `Hon’ble ${uplok} → ${toio}`; }

    if (item.forward_by_uplokayukt && item.sent_through_rk === 1 && item.forward_to_ro_aro) { return `Hon’ble ${uplok} → Record Section (RC) → ${toRoAro}`; }
    if (item.forward_by_uplokayukt && item.forward_to_ro_aro) { return `Hon’ble ${uplok} → ${toRoAro}`; }

    if (item.forward_by_uplokayukt && item.sent_through_rk === 1 && item.forward_to_ro) { return `Hon’ble ${uplok} → Record Section (RC) → ${toRo}`; }
    if (item.forward_by_uplokayukt && item.forward_to_ro) { return `Hon’ble ${uplok} → ${toRo}`; }

    if (item.forward_by_uplokayukt && item.sent_through_rk === 1 && item.forward_to_js) { return `Hon’ble ${uplok} → Record Section (RC) → ${toJs}`; }
    if (item.forward_by_uplokayukt && item.forward_to_js) { return `Hon’ble ${uplok} → ${toJs}`; }

    if (item.forward_by_uplokayukt && item.sent_through_rk === 1 && item.forward_to_us) { return `Hon’ble ${uplok} → Record Section (RC) → ${toUs}`; }
    if (item.forward_by_uplokayukt && item.forward_to_us) { return `Hon’ble ${uplok} → ${toUs}`; }

    if (item.forward_by_uplokayukt && item.sent_through_rk === 1 && item.forward_to_ds) { return `Hon’ble ${uplok} → Record Section (RC) → ${toDs}`; }
    if (item.forward_by_uplokayukt && item.forward_to_ds) { return `Hon’ble ${uplok} → ${toDs}`; }

    if (item.forward_by_uplokayukt && item.sent_through_rk === 1 && item.forward_to_dispatch) { return `Hon’ble ${uplok} → Record Section (RC) → ${toDispatch}`; }
    if (item.forward_by_uplokayukt && item.forward_to_dispatch) { return `Hon’ble ${uplok} → ${toDispatch}`; }

    if (item.forward_by_uplokayukt && item.sent_through_rk === 1 && item.forward_to_so) { return `Hon’ble ${uplok} → Record Section (RC) → ${toSo}`; }
    if (item.forward_by_uplokayukt && item.forward_to_so) { return `Hon’ble ${uplok} → ${toSo}`; }

    if (item.forward_by_uplokayukt && item.sent_through_rk === 1 && item.forward_to_pro) { return `Hon’ble ${uplok} → Record Section (RC) → ${toPro}`; }
    if (item.forward_by_uplokayukt && item.forward_to_pro) { return `Hon’ble ${uplok} → ${toPro}`; }

    if (item.forward_by_uplokayukt && item.sent_through_rk === 1 && item.forward_to_aps) { return `Hon’ble ${uplok} → Record Section (RC) → ${toAps}`; }
    if (item.forward_by_uplokayukt && item.forward_to_aps) { return `Hon’ble ${uplok} → ${toAps}`; }

    if (item.forward_by_uplokayukt && item.sent_through_rk === 1 && item.forward_to_st) { return `Hon’ble ${uplok} → Record Section (RC) → ${toSt}`; }
    if (item.forward_by_uplokayukt && item.forward_to_st) { return `Hon’ble ${uplok} → ${toSt}`; }

    if (item.forward_by_uplokayukt && item.sent_through_rk === 1 && item.forward_to_ac) { return `Hon’ble ${uplok} → Record Section (RC) → ${toAc}`; }
    if (item.forward_by_uplokayukt && item.forward_to_ac) { return `Hon’ble ${uplok} → ${toAc}`; }

    /* ================= PS ================= */
    if (item.forward_by_ps && item.sent_through_rk === 1 && item.forward_to_lokayukt) { return `${ps} → Record Section (RC) → Hon’ble ${toLok}`; }
    if (item.forward_by_ps && item.forward_to_lokayukt) { return `${ps} → Hon’ble ${toLok}`; }

    if (item.forward_by_ps && item.sent_through_rk === 1 && item.forward_to_uplokayukt) { return `${ps} → Record Section (RC) → Hon’ble ${toUpLok}`; }
    if (item.forward_by_ps && item.forward_to_uplokayukt) { return `${ps} → Hon’ble ${toUpLok}`; }

    if (item.forward_by_ps && item.sent_through_rk === 1 && item.forward_to_sec) { return `${ps} → Record Section (RC) → ${toSec}`; }
    if (item.forward_by_ps && item.forward_to_sec) { return `${ps} → ${toSec}`; }

    if (item.forward_by_ps && item.sent_through_rk === 1 && item.forward_to_ps) { return `${ps} → Record Section (RC) → ${toPs}`; }
    if (item.forward_by_ps && item.forward_to_ps) { return `${ps} → ${toPs}`; }

    if (item.forward_by_ps && item.sent_through_rk === 1 && item.forward_to_cio_io) { return `${ps} → Record Section (RC) → ${toCio}`; }
    if (item.forward_by_ps && item.forward_to_cio_io) { return `${ps} → ${toCio}`; }

    if (item.forward_by_ps && item.sent_through_rk === 1 && item.forward_to_io) { return `${ps} → Record Section (RC) → ${toio}`; }
    if (item.forward_by_ps && item.forward_to_io) { return `${ps} → ${toio}`; }

    if (item.forward_by_ps && item.sent_through_rk === 1 && item.forward_to_ro_aro) { return `${ps} → Record Section (RC) → ${toRoAro}`; }
    if (item.forward_by_ps && item.forward_to_ro_aro) { return `${ps} → ${toRoAro}`; }

    if (item.forward_by_ps && item.sent_through_rk === 1 && item.forward_to_ro) { return `${ps} → Record Section (RC) → ${toRo}`; }
    if (item.forward_by_ps && item.forward_to_ro) { return `${ps} → ${toRo}`; }

    if (item.forward_by_ps && item.sent_through_rk === 1 && item.forward_to_js) { return `${ps} → Record Section (RC) → ${toJs}`; }
    if (item.forward_by_ps && item.forward_to_js) { return `${ps} → ${toJs}`; }

    if (item.forward_by_ps && item.sent_through_rk === 1 && item.forward_to_us) { return `${ps} → Record Section (RC) → ${toUs}`; }
    if (item.forward_by_ps && item.forward_to_us) { return `${ps} → ${toUs}`; }

    if (item.forward_by_ps && item.sent_through_rk === 1 && item.forward_to_ds) { return `${ps} → Record Section (RC) → ${toDs}`; }
    if (item.forward_by_ps && item.forward_to_ds) { return `${ps} → ${toDs}`; }

    if (item.forward_by_ps && item.sent_through_rk === 1 && item.forward_to_dispatch) { return `${ps} → Record Section (RC) → ${toDispatch}`; }
    if (item.forward_by_ps && item.forward_to_dispatch) { return `${ps} → ${toDispatch}`; }

    if (item.forward_by_ps && item.sent_through_rk === 1 && item.forward_to_so) { return `${ps} → Record Section (RC) → ${toSo}`; }
    if (item.forward_by_ps && item.forward_to_so) { return `${ps} → ${toSo}`; }

    if (item.forward_by_ps && item.sent_through_rk === 1 && item.forward_to_pro) { return `${ps} → Record Section (RC) → ${toPro}`; }
    if (item.forward_by_ps && item.forward_to_pro) { return `${ps} → ${toPro}`; }

    if (item.forward_by_ps && item.sent_through_rk === 1 && item.forward_to_aps) { return `${ps} → Record Section (RC) → ${toAps}`; }
    if (item.forward_by_ps && item.forward_to_aps) { return `${ps} → ${toAps}`; }

    if (item.forward_by_ps && item.sent_through_rk === 1 && item.forward_to_st) { return `${ps} → Record Section (RC) → ${toSt}`; }
    if (item.forward_by_ps && item.forward_to_st) { return `${ps} → ${toSt}`; }

    if (item.forward_by_ps && item.sent_through_rk === 1 && item.forward_to_ac) { return `${ps} → Record Section (RC) → ${toAc}`; }
    if (item.forward_by_ps && item.forward_to_ac) { return `${ps} → ${toAc}`; }

    /* ================= RO / ARO ================= */
    if (item.forward_by_ro_aro && item.sent_through_rk === 1 && item.forward_to_lokayukt) { return `${roAro} → Record Section (RC) → Hon’ble ${toLok}`; }
    if (item.forward_by_ro_aro && item.forward_to_lokayukt) { return `${roAro} → Hon’ble ${toLok}`; }

    if (item.forward_by_ro_aro && item.sent_through_rk === 1 && item.forward_to_uplokayukt) { return `${roAro} → Record Section (RC) → Hon’ble ${toUpLok}`; }
    if (item.forward_by_ro_aro && item.forward_to_uplokayukt) { return `${roAro} → Hon’ble ${toUpLok}`; }

    if (item.forward_by_ro_aro && item.sent_through_rk === 1 && item.forward_to_sec) { return `${roAro} → Record Section (RC) → ${toSec}`; }
    if (item.forward_by_ro_aro && item.forward_to_sec) { return `${roAro} → ${toSec}`; }

    if (item.forward_by_ro_aro && item.sent_through_rk === 1 && item.forward_to_ps) { return `${roAro} → Record Section (RC) → ${toPs}`; }
    if (item.forward_by_ro_aro && item.forward_to_ps) { return `${roAro} → ${toPs}`; }

    if (item.forward_by_ro_aro && item.sent_through_rk === 1 && item.forward_to_cio_io) { return `${roAro} → Record Section (RC) → ${toCio}`; }
    if (item.forward_by_ro_aro && item.forward_to_cio_io) { return `${roAro} → ${toCio}`; }

    if (item.forward_by_ro_aro && item.sent_through_rk === 1 && item.forward_to_io) { return `${roAro} → Record Section (RC) → ${toio}`; }
    if (item.forward_by_ro_aro && item.forward_to_io) { return `${roAro} → ${toio}`; }

    if (item.forward_by_ro_aro && item.sent_through_rk === 1 && item.forward_to_ro_aro) { return `${roAro} → Record Section (RC) → ${toRoAro}`; }
    if (item.forward_by_ro_aro && item.forward_to_ro_aro) { return `${roAro} → ${toRoAro}`; }

    if (item.forward_by_ro_aro && item.sent_through_rk === 1 && item.forward_to_ro) { return `${roAro} → Record Section (RC) → ${toRo}`; }
    if (item.forward_by_ro_aro && item.forward_to_ro) { return `${roAro} → ${toRo}`; }

    if (item.forward_by_ro_aro && item.sent_through_rk === 1 && item.forward_to_js) { return `${roAro} → Record Section (RC) → ${toJs}`; }
    if (item.forward_by_ro_aro && item.forward_to_js) { return `${roAro} → ${toJs}`; }

    if (item.forward_by_ro_aro && item.sent_through_rk === 1 && item.forward_to_us) { return `${roAro} → Record Section (RC) → ${toUs}`; }
    if (item.forward_by_ro_aro && item.forward_to_us) { return `${roAro} → ${toUs}`; }

    if (item.forward_by_ro_aro && item.sent_through_rk === 1 && item.forward_to_ds) { return `${roAro} → Record Section (RC) → ${toDs}`; }
    if (item.forward_by_ro_aro && item.forward_to_ds) { return `${roAro} → ${toDs}`; }

    if (item.forward_by_ro_aro && item.sent_through_rk === 1 && item.forward_to_dispatch) { return `${roAro} → Record Section (RC) → ${toDispatch}`; }
    if (item.forward_by_ro_aro && item.forward_to_dispatch) { return `${roAro} → ${toDispatch}`; }

    if (item.forward_by_ro_aro && item.sent_through_rk === 1 && item.forward_to_so) { return `${roAro} → Record Section (RC) → ${toSo}`; }
    if (item.forward_by_ro_aro && item.forward_to_so) { return `${roAro} → ${toSo}`; }

    if (item.forward_by_ro_aro && item.sent_through_rk === 1 && item.forward_to_pro) { return `${roAro} → Record Section (RC) → ${toPro}`; }
    if (item.forward_by_ro_aro && item.forward_to_pro) { return `${roAro} → ${toPro}`; }

    if (item.forward_by_ro_aro && item.sent_through_rk === 1 && item.forward_to_aps) { return `${roAro} → Record Section (RC) → ${toAps}`; }
    if (item.forward_by_ro_aro && item.forward_to_aps) { return `${roAro} → ${toAps}`; }

    if (item.forward_by_ro_aro && item.sent_through_rk === 1 && item.forward_to_st) { return `${roAro} → Record Section (RC) → ${toSt}`; }
    if (item.forward_by_ro_aro && item.forward_to_st) { return `${roAro} → ${toSt}`; }

    if (item.forward_by_ro_aro && item.sent_through_rk === 1 && item.forward_to_ac) { return `${roAro} → Record Section (RC) → ${toAc}`; }
    if (item.forward_by_ro_aro && item.forward_to_ac) { return `${roAro} → ${toAc}`; }

    /* ================= RO ================= */
    if (item.forward_by_ro && item.sent_through_rk === 1 && item.forward_to_lokayukt) { return `${ro} → Record Section (RC) → Hon’ble ${toLok}`; }
    if (item.forward_by_ro && item.forward_to_lokayukt) { return `${ro} → Hon’ble ${toLok}`; }

    if (item.forward_by_ro && item.sent_through_rk === 1 && item.forward_to_uplokayukt) { return `${ro} → Record Section (RC) → Hon’ble ${toUpLok}`; }
    if (item.forward_by_ro && item.forward_to_uplokayukt) { return `${ro} → Hon’ble ${toUpLok}`; }

    if (item.forward_by_ro && item.sent_through_rk === 1 && item.forward_to_sec) { return `${ro} → Record Section (RC) → ${toSec}`; }
    if (item.forward_by_ro && item.forward_to_sec) { return `${ro} → ${toSec}`; }

    if (item.forward_by_ro && item.sent_through_rk === 1 && item.forward_to_ps) { return `${ro} → Record Section (RC) → ${toPs}`; }
    if (item.forward_by_ro && item.forward_to_ps) { return `${ro} → ${toPs}`; }

    if (item.forward_by_ro && item.sent_through_rk === 1 && item.forward_to_cio_io) { return `${ro} → Record Section (RC) → ${toCio}`; }
    if (item.forward_by_ro && item.forward_to_cio_io) { return `${ro} → ${toCio}`; }

    if (item.forward_by_ro && item.sent_through_rk === 1 && item.forward_to_io) { return `${ro} → Record Section (RC) → ${toio}`; }
    if (item.forward_by_ro && item.forward_to_io) { return `${ro} → ${toio}`; }

    if (item.forward_by_ro && item.sent_through_rk === 1 && item.forward_to_ro_aro) { return `${ro} → Record Section (RC) → ${toRoAro}`; }
    if (item.forward_by_ro && item.forward_to_ro_aro) { return `${ro} → ${toRoAro}`; }

    if (item.forward_by_ro && item.sent_through_rk === 1 && item.forward_to_ro) { return `${ro} → Record Section (RC) → ${toRo}`; }
    if (item.forward_by_ro && item.forward_to_ro) { return `${ro} → ${toRo}`; }

    if (item.forward_by_ro && item.sent_through_rk === 1 && item.forward_to_js) { return `${ro} → Record Section (RC) → ${toJs}`; }
    if (item.forward_by_ro && item.forward_to_js) { return `${ro} → ${toJs}`; }

    if (item.forward_by_ro && item.sent_through_rk === 1 && item.forward_to_us) { return `${ro} → Record Section (RC) → ${toUs}`; }
    if (item.forward_by_ro && item.forward_to_us) { return `${ro} → ${toUs}`; }

    if (item.forward_by_ro && item.sent_through_rk === 1 && item.forward_to_ds) { return `${ro} → Record Section (RC) → ${toDs}`; }
    if (item.forward_by_ro && item.forward_to_ds) { return `${ro} → ${toDs}`; }

    if (item.forward_by_ro && item.sent_through_rk === 1 && item.forward_to_dispatch) { return `${ro} → Record Section (RC) → ${toDispatch}`; }
    if (item.forward_by_ro && item.forward_to_dispatch) { return `${ro} → ${toDispatch}`; }

    if (item.forward_by_ro && item.sent_through_rk === 1 && item.forward_to_so) { return `${ro} → Record Section (RC) → ${toSo}`; }
    if (item.forward_by_ro && item.forward_to_so) { return `${ro} → ${toSo}`; }

    if (item.forward_by_ro && item.sent_through_rk === 1 && item.forward_to_pro) { return `${ro} → Record Section (RC) → ${toPro}`; }
    if (item.forward_by_ro && item.forward_to_pro) { return `${ro} → ${toPro}`; }

    if (item.forward_by_ro && item.sent_through_rk === 1 && item.forward_to_aps) { return `${ro} → Record Section (RC) → ${toAps}`; }
    if (item.forward_by_ro && item.forward_to_aps) { return `${ro} → ${toAps}`; }

    if (item.forward_by_ro && item.sent_through_rk === 1 && item.forward_to_st) { return `${ro} → Record Section (RC) → ${toSt}`; }
    if (item.forward_by_ro && item.forward_to_st) { return `${ro} → ${toSt}`; }

    if (item.forward_by_ro && item.sent_through_rk === 1 && item.forward_to_ac) { return `${ro} → Record Section (RC) → ${toAc}`; }
    if (item.forward_by_ro && item.forward_to_ac) { return `${ro} → ${toAc}`; }

    /* ================= CIO ================= */
    if (item.forward_by_cio_io && item.sent_through_rk === 1 && item.forward_to_lokayukt) { return `${cio} → Record Section (RC) → Hon’ble ${toLok}`; }
    if (item.forward_by_cio_io && item.forward_to_lokayukt) { return `${cio} → Hon’ble ${toLok}`; }

    if (item.forward_by_cio_io && item.sent_through_rk === 1 && item.forward_to_uplokayukt) { return `${cio} → Record Section (RC) → Hon’ble ${toUpLok}`; }
    if (item.forward_by_cio_io && item.forward_to_uplokayukt) { return `${cio} → Hon’ble ${toUpLok}`; }

    if (item.forward_by_cio_io && item.sent_through_rk === 1 && item.forward_to_sec) { return `${cio} → Record Section (RC) → ${toSec}`; }
    if (item.forward_by_cio_io && item.forward_to_sec) { return `${cio} → ${toSec}`; }

    if (item.forward_by_cio_io && item.sent_through_rk === 1 && item.forward_to_ps) { return `${cio} → Record Section (RC) → ${toPs}`; }
    if (item.forward_by_cio_io && item.forward_to_ps) { return `${cio} → ${toPs}`; }

    if (item.forward_by_cio_io && item.sent_through_rk === 1 && item.forward_to_cio_io) { return `${cio} → Record Section (RC) → ${toCio}`; }
    if (item.forward_by_cio_io && item.forward_to_cio_io) { return `${cio} → ${toCio}`; }

    if (item.forward_by_cio_io && item.sent_through_rk === 1 && item.forward_to_io) { return `${cio} → Record Section (RC) → ${toio}`; }
    if (item.forward_by_cio_io && item.forward_to_io) { return `${cio} → ${toio}`; }

    if (item.forward_by_cio_io && item.sent_through_rk === 1 && item.forward_to_ro_aro) { return `${cio} → Record Section (RC) → ${toRoAro}`; }
    if (item.forward_by_cio_io && item.forward_to_ro_aro) { return `${cio} → ${toRoAro}`; }

    if (item.forward_by_cio_io && item.sent_through_rk === 1 && item.forward_to_ro) { return `${cio} → Record Section (RC) → ${toRo}`; }
    if (item.forward_by_cio_io && item.forward_to_ro) { return `${cio} → ${toRo}`; }

    if (item.forward_by_cio_io && item.sent_through_rk === 1 && item.forward_to_js) { return `${cio} → Record Section (RC) → ${toJs}`; }
    if (item.forward_by_cio_io && item.forward_to_js) { return `${cio} → ${toJs}`; }

    if (item.forward_by_cio_io && item.sent_through_rk === 1 && item.forward_to_us) { return `${cio} → Record Section (RC) → ${toUs}`; }
    if (item.forward_by_cio_io && item.forward_to_us) { return `${cio} → ${toUs}`; }

    if (item.forward_by_cio_io && item.sent_through_rk === 1 && item.forward_to_ds) { return `${cio} → Record Section (RC) → ${toDs}`; }
    if (item.forward_by_cio_io && item.forward_to_ds) { return `${cio} → ${toDs}`; }

    if (item.forward_by_cio_io && item.sent_through_rk === 1 && item.forward_to_dispatch) { return `${cio} → Record Section (RC) → ${toDispatch}`; }
    if (item.forward_by_cio_io && item.forward_to_dispatch) { return `${cio} → ${toDispatch}`; }

    if (item.forward_by_cio_io && item.sent_through_rk === 1 && item.forward_to_so) { return `${cio} → Record Section (RC) → ${toSo}`; }
    if (item.forward_by_cio_io && item.forward_to_so) { return `${cio} → ${toSo}`; }

    if (item.forward_by_cio_io && item.sent_through_rk === 1 && item.forward_to_pro) { return `${cio} → Record Section (RC) → ${toPro}`; }
    if (item.forward_by_cio_io && item.forward_to_pro) { return `${cio} → ${toPro}`; }

    if (item.forward_by_cio_io && item.sent_through_rk === 1 && item.forward_to_aps) { return `${cio} → Record Section (RC) → ${toAps}`; }
    if (item.forward_by_cio_io && item.forward_to_aps) { return `${cio} → ${toAps}`; }

    if (item.forward_by_cio_io && item.sent_through_rk === 1 && item.forward_to_st) { return `${cio} → Record Section (RC) → ${toSt}`; }
    if (item.forward_by_cio_io && item.forward_to_st) { return `${cio} → ${toSt}`; }

    if (item.forward_by_cio_io && item.sent_through_rk === 1 && item.forward_to_ac) { return `${cio} → Record Section (RC) → ${toAc}`; }
    if (item.forward_by_cio_io && item.forward_to_ac) { return `${cio} → ${toAc}`; }

    /* ================= IO ================= */
    if (item.forward_by_io && item.sent_through_rk === 1 && item.forward_to_lokayukt) { return `${io} → Record Section (RC) → Hon’ble ${toLok}`; }
    if (item.forward_by_io && item.forward_to_lokayukt) { return `${io} → Hon’ble ${toLok}`; }

    if (item.forward_by_io && item.sent_through_rk === 1 && item.forward_to_uplokayukt) { return `${io} → Record Section (RC) → Hon’ble ${toUpLok}`; }
    if (item.forward_by_io && item.forward_to_uplokayukt) { return `${io} → Hon’ble ${toUpLok}`; }

    if (item.forward_by_io && item.sent_through_rk === 1 && item.forward_to_sec) { return `${io} → Record Section (RC) → ${toSec}`; }
    if (item.forward_by_io && item.forward_to_sec) { return `${io} → ${toSec}`; }

    if (item.forward_by_io && item.sent_through_rk === 1 && item.forward_to_ps) { return `${io} → Record Section (RC) → ${toPs}`; }
    if (item.forward_by_io && item.forward_to_ps) { return `${io} → ${toPs}`; }

    if (item.forward_by_io && item.sent_through_rk === 1 && item.forward_to_cio_io) { return `${io} → Record Section (RC) → ${toCio}`; }
    if (item.forward_by_io && item.forward_to_cio_io) { return `${io} → ${toCio}`; }

    if (item.forward_by_io && item.sent_through_rk === 1 && item.forward_to_io) { return `${io} → Record Section (RC) → ${toio}`; }
    if (item.forward_by_io && item.forward_to_io) { return `${io} → ${toio}`; }

    if (item.forward_by_io && item.sent_through_rk === 1 && item.forward_to_ro_aro) { return `${io} → Record Section (RC) → ${toRoAro}`; }
    if (item.forward_by_io && item.forward_to_ro_aro) { return `${io} → ${toRoAro}`; }

    if (item.forward_by_io && item.sent_through_rk === 1 && item.forward_to_ro) { return `${io} → Record Section (RC) → ${toRo}`; }
    if (item.forward_by_io && item.forward_to_ro) { return `${io} → ${toRo}`; }

    if (item.forward_by_io && item.sent_through_rk === 1 && item.forward_to_js) { return `${io} → Record Section (RC) → ${toJs}`; }
    if (item.forward_by_io && item.forward_to_js) { return `${io} → ${toJs}`; }

    if (item.forward_by_io && item.sent_through_rk === 1 && item.forward_to_us) { return `${io} → Record Section (RC) → ${toUs}`; }
    if (item.forward_by_io && item.forward_to_us) { return `${io} → ${toUs}`; }

    if (item.forward_by_io && item.sent_through_rk === 1 && item.forward_to_ds) { return `${io} → Record Section (RC) → ${toDs}`; }
    if (item.forward_by_io && item.forward_to_ds) { return `${io} → ${toDs}`; }

    if (item.forward_by_io && item.sent_through_rk === 1 && item.forward_to_dispatch) { return `${io} → Record Section (RC) → ${toDispatch}`; }
    if (item.forward_by_io && item.forward_to_dispatch) { return `${io} → ${toDispatch}`; }

    if (item.forward_by_io && item.sent_through_rk === 1 && item.forward_to_so) { return `${io} → Record Section (RC) → ${toSo}`; }
    if (item.forward_by_io && item.forward_to_so) { return `${io} → ${toSo}`; }

    if (item.forward_by_io && item.sent_through_rk === 1 && item.forward_to_pro) { return `${io} → Record Section (RC) → ${toPro}`; }
    if (item.forward_by_io && item.forward_to_pro) { return `${io} → ${toPro}`; }

    if (item.forward_by_io && item.sent_through_rk === 1 && item.forward_to_aps) { return `${io} → Record Section (RC) → ${toAps}`; }
    if (item.forward_by_io && item.forward_to_aps) { return `${io} → ${toAps}`; }

    if (item.forward_by_io && item.sent_through_rk === 1 && item.forward_to_st) { return `${io} → Record Section (RC) → ${toSt}`; }
    if (item.forward_by_io && item.forward_to_st) { return `${io} → ${toSt}`; }

    if (item.forward_by_io && item.sent_through_rk === 1 && item.forward_to_ac) { return `${io} → Record Section (RC) → ${toAc}`; }
    if (item.forward_by_io && item.forward_to_ac) { return `${io} → ${toAc}`; }

    /* ================= SECRETARY ================= */
    if (item.forward_by_sec && item.sent_through_rk === 1 && item.forward_to_lokayukt) { return `${sec} → Record Section (RC) → Hon’ble ${toLok}`; }
    if (item.forward_by_sec && item.forward_to_lokayukt) { return `${sec} → Hon’ble ${toLok}`; }

    if (item.forward_by_sec && item.sent_through_rk === 1 && item.forward_to_uplokayukt) { return `${sec} → Record Section (RC) → Hon’ble ${toUpLok}`; }
    if (item.forward_by_sec && item.forward_to_uplokayukt) { return `${sec} → Hon’ble ${toUpLok}`; }

    if (item.forward_by_sec && item.sent_through_rk === 1 && item.forward_to_sec) { return `${sec} → Record Section (RC) → ${toSec}`; }
    if (item.forward_by_sec && item.forward_to_sec) { return `${sec} → ${toSec}`; }

    if (item.forward_by_sec && item.sent_through_rk === 1 && item.forward_to_ps) { return `${sec} → Record Section (RC) → ${toPs}`; }
    if (item.forward_by_sec && item.forward_to_ps) { return `${sec} → ${toPs}`; }

    if (item.forward_by_sec && item.sent_through_rk === 1 && item.forward_to_cio_io) { return `${sec} → Record Section (RC) → ${toCio}`; }
    if (item.forward_by_sec && item.forward_to_cio_io) { return `${sec} → ${toCio}`; }

    if (item.forward_by_sec && item.sent_through_rk === 1 && item.forward_to_io) { return `${sec} → Record Section (RC) → ${toio}`; }
    if (item.forward_by_sec && item.forward_to_io) { return `${sec} → ${toio}`; }

    if (item.forward_by_sec && item.sent_through_rk === 1 && item.forward_to_ro_aro) { return `${sec} → Record Section (RC) → ${toRoAro}`; }
    if (item.forward_by_sec && item.forward_to_ro_aro) { return `${sec} → ${toRoAro}`; }

    if (item.forward_by_sec && item.sent_through_rk === 1 && item.forward_to_ro) { return `${sec} → Record Section (RC) → ${toRo}`; }
    if (item.forward_by_sec && item.forward_to_ro) { return `${sec} → ${toRo}`; }

    if (item.forward_by_sec && item.sent_through_rk === 1 && item.forward_to_js) { return `${sec} → Record Section (RC) → ${toJs}`; }
    if (item.forward_by_sec && item.forward_to_js) { return `${sec} → ${toJs}`; }

    if (item.forward_by_sec && item.sent_through_rk === 1 && item.forward_to_us) { return `${sec} → Record Section (RC) → ${toUs}`; }
    if (item.forward_by_sec && item.forward_to_us) { return `${sec} → ${toUs}`; }

    if (item.forward_by_sec && item.sent_through_rk === 1 && item.forward_to_ds) { return `${sec} → Record Section (RC) → ${toDs}`; }
    if (item.forward_by_sec && item.forward_to_ds) { return `${sec} → ${toDs}`; }

    if (item.forward_by_sec && item.sent_through_rk === 1 && item.forward_to_dispatch) { return `${sec} → Record Section (RC) → ${toDispatch}`; }
    if (item.forward_by_sec && item.forward_to_dispatch) { return `${sec} → ${toDispatch}`; }

    if (item.forward_by_sec && item.sent_through_rk === 1 && item.forward_to_so) { return `${sec} → Record Section (RC) → ${toSo}`; }
    if (item.forward_by_sec && item.forward_to_so) { return `${sec} → ${toSo}`; }

    if (item.forward_by_sec && item.sent_through_rk === 1 && item.forward_to_pro) { return `${sec} → Record Section (RC) → ${toPro}`; }
    if (item.forward_by_sec && item.forward_to_pro) { return `${sec} → ${toPro}`; }

    if (item.forward_by_sec && item.sent_through_rk === 1 && item.forward_to_aps) { return `${sec} → Record Section (RC) → ${toAps}`; }
    if (item.forward_by_sec && item.forward_to_aps) { return `${sec} → ${toAps}`; }

    if (item.forward_by_sec && item.sent_through_rk === 1 && item.forward_to_st) { return `${sec} → Record Section (RC) → ${toSt}`; }
    if (item.forward_by_sec && item.forward_to_st) { return `${sec} → ${toSt}`; }

    if (item.forward_by_sec && item.sent_through_rk === 1 && item.forward_to_ac) { return `${sec} → Record Section (RC) → ${toAc}`; }
    if (item.forward_by_sec && item.forward_to_ac) { return `${sec} → ${toAc}`; }

    /* ================= JS ================= */
    if (item.forward_by_js && item.sent_through_rk === 1 && item.forward_to_lokayukt) { return `${js} → Record Section (RC) → Hon’ble ${toLok}`; }
    if (item.forward_by_js && item.forward_to_lokayukt) { return `${js} → Hon’ble ${toLok}`; }

    if (item.forward_by_js && item.sent_through_rk === 1 && item.forward_to_uplokayukt) { return `${js} → Record Section (RC) → Hon’ble ${toUpLok}`; }
    if (item.forward_by_js && item.forward_to_uplokayukt) { return `${js} → Hon’ble ${toUpLok}`; }

    if (item.forward_by_js && item.sent_through_rk === 1 && item.forward_to_sec) { return `${js} → Record Section (RC) → ${toSec}`; }
    if (item.forward_by_js && item.forward_to_sec) { return `${js} → ${toSec}`; }

    if (item.forward_by_js && item.sent_through_rk === 1 && item.forward_to_ps) { return `${js} → Record Section (RC) → ${toPs}`; }
    if (item.forward_by_js && item.forward_to_ps) { return `${js} → ${toPs}`; }

    if (item.forward_by_js && item.sent_through_rk === 1 && item.forward_to_cio_io) { return `${js} → Record Section (RC) → ${toCio}`; }
    if (item.forward_by_js && item.forward_to_cio_io) { return `${js} → ${toCio}`; }

    if (item.forward_by_js && item.sent_through_rk === 1 && item.forward_to_io) { return `${js} → Record Section (RC) → ${toio}`; }
    if (item.forward_by_js && item.forward_to_io) { return `${js} → ${toio}`; }

    if (item.forward_by_js && item.sent_through_rk === 1 && item.forward_to_ro_aro) { return `${js} → Record Section (RC) → ${toRoAro}`; }
    if (item.forward_by_js && item.forward_to_ro_aro) { return `${js} → ${toRoAro}`; }

    if (item.forward_by_js && item.sent_through_rk === 1 && item.forward_to_ro) { return `${js} → Record Section (RC) → ${toRo}`; }
    if (item.forward_by_js && item.forward_to_ro) { return `${js} → ${toRo}`; }

    if (item.forward_by_js && item.sent_through_rk === 1 && item.forward_to_us) { return `${js} → Record Section (RC) → ${toUs}`; }
    if (item.forward_by_js && item.forward_to_us) { return `${js} → ${toUs}`; }

    if (item.forward_by_js && item.sent_through_rk === 1 && item.forward_to_ds) { return `${js} → Record Section (RC) → ${toDs}`; }
    if (item.forward_by_js && item.forward_to_ds) { return `${js} → ${toDs}`; }

    if (item.forward_by_js && item.sent_through_rk === 1 && item.forward_to_dispatch) { return `${js} → Record Section (RC) → ${toDispatch}`; }
    if (item.forward_by_js && item.forward_to_dispatch) { return `${js} → ${toDispatch}`; }

    if (item.forward_by_js && item.sent_through_rk === 1 && item.forward_to_so) { return `${js} → Record Section (RC) → ${toSo}`; }
    if (item.forward_by_js && item.forward_to_so) { return `${js} → ${toSo}`; }

    if (item.forward_by_js && item.sent_through_rk === 1 && item.forward_to_pro) { return `${js} → Record Section (RC) → ${toPro}`; }
    if (item.forward_by_js && item.forward_to_pro) { return `${js} → ${toPro}`; }

    if (item.forward_by_js && item.sent_through_rk === 1 && item.forward_to_aps) { return `${js} → Record Section (RC) → ${toAps}`; }
    if (item.forward_by_js && item.forward_to_aps) { return `${js} → ${toAps}`; }

    if (item.forward_by_js && item.sent_through_rk === 1 && item.forward_to_st) { return `${js} → Record Section (RC) → ${toSt}`; }
    if (item.forward_by_js && item.forward_to_st) { return `${js} → ${toSt}`; }

    if (item.forward_by_js && item.sent_through_rk === 1 && item.forward_to_ac) { return `${js} → Record Section (RC) → ${toAc}`; }
    if (item.forward_by_js && item.forward_to_ac) { return `${js} → ${toAc}`; }

    /* ================= US ================= */
    if (item.forward_by_us && item.sent_through_rk === 1 && item.forward_to_lokayukt) { return `${us} → Record Section (RC) → Hon’ble ${toLok}`; }
    if (item.forward_by_us && item.forward_to_lokayukt) { return `${us} → Hon’ble ${toLok}`; }

    if (item.forward_by_us && item.sent_through_rk === 1 && item.forward_to_uplokayukt) { return `${us} → Record Section (RC) → Hon’ble ${toUpLok}`; }
    if (item.forward_by_us && item.forward_to_uplokayukt) { return `${us} → Hon’ble ${toUpLok}`; }

    if (item.forward_by_us && item.sent_through_rk === 1 && item.forward_to_sec) { return `${us} → Record Section (RC) → ${toSec}`; }
    if (item.forward_by_us && item.forward_to_sec) { return `${us} → ${toSec}`; }

    if (item.forward_by_us && item.sent_through_rk === 1 && item.forward_to_ps) { return `${us} → Record Section (RC) → ${toPs}`; }
    if (item.forward_by_us && item.forward_to_ps) { return `${us} → ${toPs}`; }

    if (item.forward_by_us && item.sent_through_rk === 1 && item.forward_to_cio_io) { return `${us} → Record Section (RC) → ${toCio}`; }
    if (item.forward_by_us && item.forward_to_cio_io) { return `${us} → ${toCio}`; }

    if (item.forward_by_us && item.sent_through_rk === 1 && item.forward_to_io) { return `${us} → Record Section (RC) → ${toio}`; }
    if (item.forward_by_us && item.forward_to_io) { return `${us} → ${toio}`; }

    if (item.forward_by_us && item.sent_through_rk === 1 && item.forward_to_ro_aro) { return `${us} → Record Section (RC) → ${toRoAro}`; }
    if (item.forward_by_us && item.forward_to_ro_aro) { return `${us} → ${toRoAro}`; }

    if (item.forward_by_us && item.sent_through_rk === 1 && item.forward_to_ro) { return `${us} → Record Section (RC) → ${toRo}`; }
    if (item.forward_by_us && item.forward_to_ro) { return `${us} → ${toRo}`; }

    if (item.forward_by_us && item.sent_through_rk === 1 && item.forward_to_js) { return `${us} → Record Section (RC) → ${toJs}`; }
    if (item.forward_by_us && item.forward_to_js) { return `${us} → ${toJs}`; }

    if (item.forward_by_us && item.sent_through_rk === 1 && item.forward_to_ds) { return `${us} → Record Section (RC) → ${toDs}`; }
    if (item.forward_by_us && item.forward_to_ds) { return `${us} → ${toDs}`; }

    if (item.forward_by_us && item.sent_through_rk === 1 && item.forward_to_dispatch) { return `${us} → Record Section (RC) → ${toDispatch}`; }
    if (item.forward_by_us && item.forward_to_dispatch) { return `${us} → ${toDispatch}`; }

    if (item.forward_by_us && item.sent_through_rk === 1 && item.forward_to_so) { return `${us} → Record Section (RC) → ${toSo}`; }
    if (item.forward_by_us && item.forward_to_so) { return `${us} → ${toSo}`; }

    if (item.forward_by_us && item.sent_through_rk === 1 && item.forward_to_pro) { return `${us} → Record Section (RC) → ${toPro}`; }
    if (item.forward_by_us && item.forward_to_pro) { return `${us} → ${toPro}`; }

    if (item.forward_by_us && item.sent_through_rk === 1 && item.forward_to_aps) { return `${us} → Record Section (RC) → ${toAps}`; }
    if (item.forward_by_us && item.forward_to_aps) { return `${us} → ${toAps}`; }

    if (item.forward_by_us && item.sent_through_rk === 1 && item.forward_to_st) { return `${us} → Record Section (RC) → ${toSt}`; }
    if (item.forward_by_us && item.forward_to_st) { return `${us} → ${toSt}`; }

    if (item.forward_by_us && item.sent_through_rk === 1 && item.forward_to_ac) { return `${us} → Record Section (RC) → ${toAc}`; }
    if (item.forward_by_us && item.forward_to_ac) { return `${us} → ${toAc}`; }

    /* ================= DS ================= */
    if (item.forward_by_ds && item.sent_through_rk === 1 && item.forward_to_lokayukt) { return `${ds} → Record Section (RC) → Hon’ble ${toLok}`; }
    if (item.forward_by_ds && item.forward_to_lokayukt) { return `${ds} → Hon’ble ${toLok}`; }

    if (item.forward_by_ds && item.sent_through_rk === 1 && item.forward_to_uplokayukt) { return `${ds} → Record Section (RC) → Hon’ble ${toUpLok}`; }
    if (item.forward_by_ds && item.forward_to_uplokayukt) { return `${ds} → Hon’ble ${toUpLok}`; }

    if (item.forward_by_ds && item.sent_through_rk === 1 && item.forward_to_sec) { return `${ds} → Record Section (RC) → ${toSec}`; }
    if (item.forward_by_ds && item.forward_to_sec) { return `${ds} → ${toSec}`; }

    if (item.forward_by_ds && item.sent_through_rk === 1 && item.forward_to_ps) { return `${ds} → Record Section (RC) → ${toPs}`; }
    if (item.forward_by_ds && item.forward_to_ps) { return `${ds} → ${toPs}`; }

    if (item.forward_by_ds && item.sent_through_rk === 1 && item.forward_to_cio_io) { return `${ds} → Record Section (RC) → ${toCio}`; }
    if (item.forward_by_ds && item.forward_to_cio_io) { return `${ds} → ${toCio}`; }

    if (item.forward_by_ds && item.sent_through_rk === 1 && item.forward_to_io) { return `${ds} → Record Section (RC) → ${toio}`; }
    if (item.forward_by_ds && item.forward_to_io) { return `${ds} → ${toio}`; }

    if (item.forward_by_ds && item.sent_through_rk === 1 && item.forward_to_ro_aro) { return `${ds} → Record Section (RC) → ${toRoAro}`; }
    if (item.forward_by_ds && item.forward_to_ro_aro) { return `${ds} → ${toRoAro}`; }

    if (item.forward_by_ds && item.sent_through_rk === 1 && item.forward_to_ro) { return `${ds} → Record Section (RC) → ${toRo}`; }
    if (item.forward_by_ds && item.forward_to_ro) { return `${ds} → ${toRo}`; }

    if (item.forward_by_ds && item.sent_through_rk === 1 && item.forward_to_js) { return `${ds} → Record Section (RC) → ${toJs}`; }
    if (item.forward_by_ds && item.forward_to_js) { return `${ds} → ${toJs}`; }

    if (item.forward_by_ds && item.sent_through_rk === 1 && item.forward_to_us) { return `${ds} → Record Section (RC) → ${toUs}`; }
    if (item.forward_by_ds && item.forward_to_us) { return `${ds} → ${toUs}`; }

    if (item.forward_by_ds && item.sent_through_rk === 1 && item.forward_to_dispatch) { return `${ds} → Record Section (RC) → ${toDispatch}`; }
    if (item.forward_by_ds && item.forward_to_dispatch) { return `${ds} → ${toDispatch}`; }

    if (item.forward_by_ds && item.sent_through_rk === 1 && item.forward_to_so) { return `${ds} → Record Section (RC) → ${toSo}`; }
    if (item.forward_by_ds && item.forward_to_so) { return `${ds} → ${toSo}`; }

    if (item.forward_by_ds && item.sent_through_rk === 1 && item.forward_to_pro) { return `${ds} → Record Section (RC) → ${toPro}`; }
    if (item.forward_by_ds && item.forward_to_pro) { return `${ds} → ${toPro}`; }

    if (item.forward_by_ds && item.sent_through_rk === 1 && item.forward_to_aps) { return `${ds} → Record Section (RC) → ${toAps}`; }
    if (item.forward_by_ds && item.forward_to_aps) { return `${ds} → ${toAps}`; }

    if (item.forward_by_ds && item.sent_through_rk === 1 && item.forward_to_st) { return `${ds} → Record Section (RC) → ${toSt}`; }
    if (item.forward_by_ds && item.forward_to_st) { return `${ds} → ${toSt}`; }

    if (item.forward_by_ds && item.sent_through_rk === 1 && item.forward_to_ac) { return `${ds} → Record Section (RC) → ${toAc}`; }
    if (item.forward_by_ds && item.forward_to_ac) { return `${ds} → ${toAc}`; }

    /* ================= SO ================= */
    if (item.forward_by_so && item.sent_through_rk === 1 && item.forward_to_lokayukt) { return `${so} → Record Section (RC) → Hon’ble ${toLok}`; }
    if (item.forward_by_so && item.forward_to_lokayukt) { return `${so} → Hon’ble ${toLok}`; }

    if (item.forward_by_so && item.sent_through_rk === 1 && item.forward_to_uplokayukt) { return `${so} → Record Section (RC) → Hon’ble ${toUpLok}`; }
    if (item.forward_by_so && item.forward_to_uplokayukt) { return `${so} → Hon’ble ${toUpLok}`; }

    if (item.forward_by_so && item.sent_through_rk === 1 && item.forward_to_sec) { return `${so} → Record Section (RC) → ${toSec}`; }
    if (item.forward_by_so && item.forward_to_sec) { return `${so} → ${toSec}`; }

    if (item.forward_by_so && item.sent_through_rk === 1 && item.forward_to_ps) { return `${so} → Record Section (RC) → ${toPs}`; }
    if (item.forward_by_so && item.forward_to_ps) { return `${so} → ${toPs}`; }

    if (item.forward_by_so && item.sent_through_rk === 1 && item.forward_to_cio_io) { return `${so} → Record Section (RC) → ${toCio}`; }
    if (item.forward_by_so && item.forward_to_cio_io) { return `${so} → ${toCio}`; }

    if (item.forward_by_so && item.sent_through_rk === 1 && item.forward_to_io) { return `${so} → Record Section (RC) → ${toio}`; }
    if (item.forward_by_so && item.forward_to_io) { return `${so} → ${toio}`; }

    if (item.forward_by_so && item.sent_through_rk === 1 && item.forward_to_ro_aro) { return `${so} → Record Section (RC) → ${toRoAro}`; }
    if (item.forward_by_so && item.forward_to_ro_aro) { return `${so} → ${toRoAro}`; }

    if (item.forward_by_so && item.sent_through_rk === 1 && item.forward_to_ro) { return `${so} → Record Section (RC) → ${toRo}`; }
    if (item.forward_by_so && item.forward_to_ro) { return `${so} → ${toRo}`; }

    if (item.forward_by_so && item.sent_through_rk === 1 && item.forward_to_js) { return `${so} → Record Section (RC) → ${toJs}`; }
    if (item.forward_by_so && item.forward_to_js) { return `${so} → ${toJs}`; }

    if (item.forward_by_so && item.sent_through_rk === 1 && item.forward_to_us) { return `${so} → Record Section (RC) → ${toUs}`; }
    if (item.forward_by_so && item.forward_to_us) { return `${so} → ${toUs}`; }

    if (item.forward_by_so && item.sent_through_rk === 1 && item.forward_to_ds) { return `${so} → Record Section (RC) → ${toDs}`; }
    if (item.forward_by_so && item.forward_to_ds) { return `${so} → ${toDs}`; }

    if (item.forward_by_so && item.sent_through_rk === 1 && item.forward_to_dispatch) { return `${so} → Record Section (RC) → ${toDispatch}`; }
    if (item.forward_by_so && item.forward_to_dispatch) { return `${so} → ${toDispatch}`; }

    if (item.forward_by_so && item.sent_through_rk === 1 && item.forward_to_so) { return `${so} → Record Section (RC) → ${toSo}`; }
    if (item.forward_by_so && item.forward_to_so) { return `${so} → ${toSo}`; }

    if (item.forward_by_so && item.sent_through_rk === 1 && item.forward_to_pro) { return `${so} → Record Section (RC) → ${toPro}`; }
    if (item.forward_by_so && item.forward_to_pro) { return `${so} → ${toPro}`; }

    if (item.forward_by_so && item.sent_through_rk === 1 && item.forward_to_aps) { return `${so} → Record Section (RC) → ${toAps}`; }
    if (item.forward_by_so && item.forward_to_aps) { return `${so} → ${toAps}`; }

    if (item.forward_by_so && item.sent_through_rk === 1 && item.forward_to_st) { return `${so} → Record Section (RC) → ${toSt}`; }
    if (item.forward_by_so && item.forward_to_st) { return `${so} → ${toSt}`; }

    if (item.forward_by_so && item.sent_through_rk === 1 && item.forward_to_ac) { return `${so} → Record Section (RC) → ${toAc}`; }
    if (item.forward_by_so && item.forward_to_ac) { return `${so} → ${toAc}`; }

    /* ================= PRO ================= */
    if (item.forward_by_pro && item.sent_through_rk === 1 && item.forward_to_lokayukt) { return `${pro} → Record Section (RC) → Hon’ble ${toLok}`; }
    if (item.forward_by_pro && item.forward_to_lokayukt) { return `${pro} → Hon’ble ${toLok}`; }

    if (item.forward_by_pro && item.sent_through_rk === 1 && item.forward_to_uplokayukt) { return `${pro} → Record Section (RC) → Hon’ble ${toUpLok}`; }
    if (item.forward_by_pro && item.forward_to_uplokayukt) { return `${pro} → Hon’ble ${toUpLok}`; }

    if (item.forward_by_pro && item.sent_through_rk === 1 && item.forward_to_sec) { return `${pro} → Record Section (RC) → ${toSec}`; }
    if (item.forward_by_pro && item.forward_to_sec) { return `${pro} → ${toSec}`; }

    if (item.forward_by_pro && item.sent_through_rk === 1 && item.forward_to_ps) { return `${pro} → Record Section (RC) → ${toPs}`; }
    if (item.forward_by_pro && item.forward_to_ps) { return `${pro} → ${toPs}`; }

    if (item.forward_by_pro && item.sent_through_rk === 1 && item.forward_to_cio_io) { return `${pro} → Record Section (RC) → ${toCio}`; }
    if (item.forward_by_pro && item.forward_to_cio_io) { return `${pro} → ${toCio}`; }

    if (item.forward_by_pro && item.sent_through_rk === 1 && item.forward_to_io) { return `${pro} → Record Section (RC) → ${toio}`; }
    if (item.forward_by_pro && item.forward_to_io) { return `${pro} → ${toio}`; }

    if (item.forward_by_pro && item.sent_through_rk === 1 && item.forward_to_ro_aro) { return `${pro} → Record Section (RC) → ${toRoAro}`; }
    if (item.forward_by_pro && item.forward_to_ro_aro) { return `${pro} → ${toRoAro}`; }

    if (item.forward_by_pro && item.sent_through_rk === 1 && item.forward_to_ro) { return `${pro} → Record Section (RC) → ${toRo}`; }
    if (item.forward_by_pro && item.forward_to_ro) { return `${pro} → ${toRo}`; }

    if (item.forward_by_pro && item.sent_through_rk === 1 && item.forward_to_js) { return `${pro} → Record Section (RC) → ${toJs}`; }
    if (item.forward_by_pro && item.forward_to_js) { return `${pro} → ${toJs}`; }

    if (item.forward_by_pro && item.sent_through_rk === 1 && item.forward_to_us) { return `${pro} → Record Section (RC) → ${toUs}`; }
    if (item.forward_by_pro && item.forward_to_us) { return `${pro} → ${toUs}`; }

    if (item.forward_by_pro && item.sent_through_rk === 1 && item.forward_to_ds) { return `${pro} → Record Section (RC) → ${toDs}`; }
    if (item.forward_by_pro && item.forward_to_ds) { return `${pro} → ${toDs}`; }

    if (item.forward_by_pro && item.sent_through_rk === 1 && item.forward_to_dispatch) { return `${pro} → Record Section (RC) → ${toDispatch}`; }
    if (item.forward_by_pro && item.forward_to_dispatch) { return `${pro} → ${toDispatch}`; }

    if (item.forward_by_pro && item.sent_through_rk === 1 && item.forward_to_so) { return `${pro} → Record Section (RC) → ${toSo}`; }
    if (item.forward_by_pro && item.forward_to_so) { return `${pro} → ${toSo}`; }

    if (item.forward_by_pro && item.sent_through_rk === 1 && item.forward_to_pro) { return `${pro} → Record Section (RC) → ${toPro}`; }
    if (item.forward_by_pro && item.forward_to_pro) { return `${pro} → ${toPro}`; }

    if (item.forward_by_pro && item.sent_through_rk === 1 && item.forward_to_aps) { return `${pro} → Record Section (RC) → ${toAps}`; }
    if (item.forward_by_pro && item.forward_to_aps) { return `${pro} → ${toAps}`; }

    if (item.forward_by_pro && item.sent_through_rk === 1 && item.forward_to_st) { return `${pro} → Record Section (RC) → ${toSt}`; }
    if (item.forward_by_pro && item.forward_to_st) { return `${pro} → ${toSt}`; }

    if (item.forward_by_pro && item.sent_through_rk === 1 && item.forward_to_ac) { return `${pro} → Record Section (RC) → ${toAc}`; }
    if (item.forward_by_pro && item.forward_to_ac) { return `${pro} → ${toAc}`; }

    /* ================= APS ================= */
    if (item.forward_by_aps && item.sent_through_rk === 1 && item.forward_to_lokayukt) { return `${aps} → Record Section (RC) → Hon’ble ${toLok}`; }
    if (item.forward_by_aps && item.forward_to_lokayukt) { return `${aps} → Hon’ble ${toLok}`; }

    if (item.forward_by_aps && item.sent_through_rk === 1 && item.forward_to_uplokayukt) { return `${aps} → Record Section (RC) → Hon’ble ${toUpLok}`; }
    if (item.forward_by_aps && item.forward_to_uplokayukt) { return `${aps} → Hon’ble ${toUpLok}`; }

    if (item.forward_by_aps && item.sent_through_rk === 1 && item.forward_to_sec) { return `${aps} → Record Section (RC) → ${toSec}`; }
    if (item.forward_by_aps && item.forward_to_sec) { return `${aps} → ${toSec}`; }

    if (item.forward_by_aps && item.sent_through_rk === 1 && item.forward_to_ps) { return `${aps} → Record Section (RC) → ${toPs}`; }
    if (item.forward_by_aps && item.forward_to_ps) { return `${aps} → ${toPs}`; }

    if (item.forward_by_aps && item.sent_through_rk === 1 && item.forward_to_cio_io) { return `${aps} → Record Section (RC) → ${toCio}`; }
    if (item.forward_by_aps && item.forward_to_cio_io) { return `${aps} → ${toCio}`; }

    if (item.forward_by_aps && item.sent_through_rk === 1 && item.forward_to_io) { return `${aps} → Record Section (RC) → ${toio}`; }
    if (item.forward_by_aps && item.forward_to_io) { return `${aps} → ${toio}`; }

    if (item.forward_by_aps && item.sent_through_rk === 1 && item.forward_to_ro_aro) { return `${aps} → Record Section (RC) → ${toRoAro}`; }
    if (item.forward_by_aps && item.forward_to_ro_aro) { return `${aps} → ${toRoAro}`; }

    if (item.forward_by_aps && item.sent_through_rk === 1 && item.forward_to_ro) { return `${aps} → Record Section (RC) → ${toRo}`; }
    if (item.forward_by_aps && item.forward_to_ro) { return `${aps} → ${toRo}`; }

    if (item.forward_by_aps && item.sent_through_rk === 1 && item.forward_to_js) { return `${aps} → Record Section (RC) → ${toJs}`; }
    if (item.forward_by_aps && item.forward_to_js) { return `${aps} → ${toJs}`; }

    if (item.forward_by_aps && item.sent_through_rk === 1 && item.forward_to_us) { return `${aps} → Record Section (RC) → ${toUs}`; }
    if (item.forward_by_aps && item.forward_to_us) { return `${aps} → ${toUs}`; }

    if (item.forward_by_aps && item.sent_through_rk === 1 && item.forward_to_ds) { return `${aps} → Record Section (RC) → ${toDs}`; }
    if (item.forward_by_aps && item.forward_to_ds) { return `${aps} → ${toDs}`; }

    if (item.forward_by_aps && item.sent_through_rk === 1 && item.forward_to_dispatch) { return `${aps} → Record Section (RC) → ${toDispatch}`; }
    if (item.forward_by_aps && item.forward_to_dispatch) { return `${aps} → ${toDispatch}`; }

    if (item.forward_by_aps && item.sent_through_rk === 1 && item.forward_to_so) { return `${aps} → Record Section (RC) → ${toSo}`; }
    if (item.forward_by_aps && item.forward_to_so) { return `${aps} → ${toSo}`; }

    if (item.forward_by_aps && item.sent_through_rk === 1 && item.forward_to_pro) { return `${aps} → Record Section (RC) → ${toPro}`; }
    if (item.forward_by_aps && item.forward_to_pro) { return `${aps} → ${toPro}`; }

    if (item.forward_by_aps && item.sent_through_rk === 1 && item.forward_to_aps) { return `${aps} → Record Section (RC) → ${toAps}`; }
    if (item.forward_by_aps && item.forward_to_aps) { return `${aps} → ${toAps}`; }

    if (item.forward_by_aps && item.sent_through_rk === 1 && item.forward_to_st) { return `${aps} → Record Section (RC) → ${toSt}`; }
    if (item.forward_by_aps && item.forward_to_st) { return `${aps} → ${toSt}`; }

    if (item.forward_by_aps && item.sent_through_rk === 1 && item.forward_to_ac) { return `${aps} → Record Section (RC) → ${toAc}`; }
    if (item.forward_by_aps && item.forward_to_ac) { return `${aps} → ${toAc}`; }

    /* ================= ST ================= */
    if (item.forward_by_st && item.sent_through_rk === 1 && item.forward_to_lokayukt) { return `${st} → Record Section (RC) → Hon’ble ${toLok}`; }
    if (item.forward_by_st && item.forward_to_lokayukt) { return `${st} → Hon’ble ${toLok}`; }

    if (item.forward_by_st && item.sent_through_rk === 1 && item.forward_to_uplokayukt) { return `${st} → Record Section (RC) → Hon’ble ${toUpLok}`; }
    if (item.forward_by_st && item.forward_to_uplokayukt) { return `${st} → Hon’ble ${toUpLok}`; }

    if (item.forward_by_st && item.sent_through_rk === 1 && item.forward_to_sec) { return `${st} → Record Section (RC) → ${toSec}`; }
    if (item.forward_by_st && item.forward_to_sec) { return `${st} → ${toSec}`; }

    if (item.forward_by_st && item.sent_through_rk === 1 && item.forward_to_ps) { return `${st} → Record Section (RC) → ${toPs}`; }
    if (item.forward_by_st && item.forward_to_ps) { return `${st} → ${toPs}`; }

    if (item.forward_by_st && item.sent_through_rk === 1 && item.forward_to_cio_io) { return `${st} → Record Section (RC) → ${toCio}`; }
    if (item.forward_by_st && item.forward_to_cio_io) { return `${st} → ${toCio}`; }

    if (item.forward_by_st && item.sent_through_rk === 1 && item.forward_to_io) { return `${st} → Record Section (RC) → ${toio}`; }
    if (item.forward_by_st && item.forward_to_io) { return `${st} → ${toio}`; }

    if (item.forward_by_st && item.sent_through_rk === 1 && item.forward_to_ro_aro) { return `${st} → Record Section (RC) → ${toRoAro}`; }
    if (item.forward_by_st && item.forward_to_ro_aro) { return `${st} → ${toRoAro}`; }

    if (item.forward_by_st && item.sent_through_rk === 1 && item.forward_to_ro) { return `${st} → Record Section (RC) → ${toRo}`; }
    if (item.forward_by_st && item.forward_to_ro) { return `${st} → ${toRo}`; }

    if (item.forward_by_st && item.sent_through_rk === 1 && item.forward_to_js) { return `${st} → Record Section (RC) → ${toJs}`; }
    if (item.forward_by_st && item.forward_to_js) { return `${st} → ${toJs}`; }

    if (item.forward_by_st && item.sent_through_rk === 1 && item.forward_to_us) { return `${st} → Record Section (RC) → ${toUs}`; }
    if (item.forward_by_st && item.forward_to_us) { return `${st} → ${toUs}`; }

    if (item.forward_by_st && item.sent_through_rk === 1 && item.forward_to_ds) { return `${st} → Record Section (RC) → ${toDs}`; }
    if (item.forward_by_st && item.forward_to_ds) { return `${st} → ${toDs}`; }

    if (item.forward_by_st && item.sent_through_rk === 1 && item.forward_to_dispatch) { return `${st} → Record Section (RC) → ${toDispatch}`; }
    if (item.forward_by_st && item.forward_to_dispatch) { return `${st} → ${toDispatch}`; }

    if (item.forward_by_st && item.sent_through_rk === 1 && item.forward_to_so) { return `${st} → Record Section (RC) → ${toSo}`; }
    if (item.forward_by_st && item.forward_to_so) { return `${st} → ${toSo}`; }

    if (item.forward_by_st && item.sent_through_rk === 1 && item.forward_to_pro) { return `${st} → Record Section (RC) → ${toPro}`; }
    if (item.forward_by_st && item.forward_to_pro) { return `${st} → ${toPro}`; }

    if (item.forward_by_st && item.sent_through_rk === 1 && item.forward_to_aps) { return `${st} → Record Section (RC) → ${toAps}`; }
    if (item.forward_by_st && item.forward_to_aps) { return `${st} → ${toAps}`; }

    if (item.forward_by_st && item.sent_through_rk === 1 && item.forward_to_st) { return `${st} → Record Section (RC) → ${toSt}`; }
    if (item.forward_by_st && item.forward_to_st) { return `${st} → ${toSt}`; }

    if (item.forward_by_st && item.sent_through_rk === 1 && item.forward_to_ac) { return `${st} → Record Section (RC) → ${toAc}`; }
    if (item.forward_by_st && item.forward_to_ac) { return `${st} → ${toAc}`; }

    /* ================= AC ================= */
    if (item.forward_by_ac && item.sent_through_rk === 1 && item.forward_to_lokayukt) { return `${ac} → Record Section (RC) → Hon’ble ${toLok}`; }
    if (item.forward_by_ac && item.forward_to_lokayukt) { return `${ac} → Hon’ble ${toLok}`; }

    if (item.forward_by_ac && item.sent_through_rk === 1 && item.forward_to_uplokayukt) { return `${ac} → Record Section (RC) → Hon’ble ${toUpLok}`; }
    if (item.forward_by_ac && item.forward_to_uplokayukt) { return `${ac} → Hon’ble ${toUpLok}`; }

    if (item.forward_by_ac && item.sent_through_rk === 1 && item.forward_to_sec) { return `${ac} → Record Section (RC) → ${toSec}`; }
    if (item.forward_by_ac && item.forward_to_sec) { return `${ac} → ${toSec}`; }

    if (item.forward_by_ac && item.sent_through_rk === 1 && item.forward_to_ps) { return `${ac} → Record Section (RC) → ${toPs}`; }
    if (item.forward_by_ac && item.forward_to_ps) { return `${ac} → ${toPs}`; }

    if (item.forward_by_ac && item.sent_through_rk === 1 && item.forward_to_cio_io) { return `${ac} → Record Section (RC) → ${toCio}`; }
    if (item.forward_by_ac && item.forward_to_cio_io) { return `${ac} → ${toCio}`; }

    if (item.forward_by_ac && item.sent_through_rk === 1 && item.forward_to_io) { return `${ac} → Record Section (RC) → ${toio}`; }
    if (item.forward_by_ac && item.forward_to_io) { return `${ac} → ${toio}`; }

    if (item.forward_by_ac && item.sent_through_rk === 1 && item.forward_to_ro_aro) { return `${ac} → Record Section (RC) → ${toRoAro}`; }
    if (item.forward_by_ac && item.forward_to_ro_aro) { return `${ac} → ${toRoAro}`; }

    if (item.forward_by_ac && item.sent_through_rk === 1 && item.forward_to_ro) { return `${ac} → Record Section (RC) → ${toRo}`; }
    if (item.forward_by_ac && item.forward_to_ro) { return `${ac} → ${toRo}`; }

    if (item.forward_by_ac && item.sent_through_rk === 1 && item.forward_to_js) { return `${ac} → Record Section (RC) → ${toJs}`; }
    if (item.forward_by_ac && item.forward_to_js) { return `${ac} → ${toJs}`; }

    if (item.forward_by_ac && item.sent_through_rk === 1 && item.forward_to_us) { return `${ac} → Record Section (RC) → ${toUs}`; }
    if (item.forward_by_ac && item.forward_to_us) { return `${ac} → ${toUs}`; }

    if (item.forward_by_ac && item.sent_through_rk === 1 && item.forward_to_ds) { return `${ac} → Record Section (RC) → ${toDs}`; }
    if (item.forward_by_ac && item.forward_to_ds) { return `${ac} → ${toDs}`; }

    if (item.forward_by_ac && item.sent_through_rk === 1 && item.forward_to_dispatch) { return `${ac} → Record Section (RC) → ${toDispatch}`; }
    if (item.forward_by_ac && item.forward_to_dispatch) { return `${ac} → ${toDispatch}`; }

    if (item.forward_by_ac && item.sent_through_rk === 1 && item.forward_to_so) { return `${ac} → Record Section (RC) → ${toSo}`; }
    if (item.forward_by_ac && item.forward_to_so) { return `${ac} → ${toSo}`; }

    if (item.forward_by_ac && item.sent_through_rk === 1 && item.forward_to_pro) { return `${ac} → Record Section (RC) → ${toPro}`; }
    if (item.forward_by_ac && item.forward_to_pro) { return `${ac} → ${toPro}`; }

    if (item.forward_by_ac && item.sent_through_rk === 1 && item.forward_to_aps) { return `${ac} → Record Section (RC) → ${toAps}`; }
    if (item.forward_by_ac && item.forward_to_aps) { return `${ac} → ${toAps}`; }

    if (item.forward_by_ac && item.sent_through_rk === 1 && item.forward_to_st) { return `${ac} → Record Section (RC) → ${toSt}`; }
    if (item.forward_by_ac && item.forward_to_st) { return `${ac} → ${toSt}`; }

    if (item.forward_by_ac && item.sent_through_rk === 1 && item.forward_to_ac) { return `${ac} → Record Section (RC) → ${toAc}`; }
    if (item.forward_by_ac && item.forward_to_ac) { return `${ac} → ${toAc}`; }


 /* ================= DISPATCH ================= */

              if (item.forward_by_dispatch && item.sent_through_rk === 1 && item.forward_to_rk) { return `${dispatch} → Record Section (RC) →  ${toRK}`; }
    if (item.forward_by_dispatch && item.forward_to_rk) { return `${dispatch} →  ${toRK}`; }
    if (item.forward_by_dispatch && item.sent_through_rk === 1 && item.forward_to_lokayukt) { return `${dispatch} → Record Section (RC) → Hon’ble ${toLok}`; }
    if (item.forward_by_dispatch && item.forward_to_lokayukt) { return `${dispatch} → Hon’ble ${toLok}`; }

    if (item.forward_by_dispatch && item.sent_through_rk === 1 && item.forward_to_uplokayukt) { return `${dispatch} → Record Section (RC) → Hon’ble ${toUpLok}`; }
    if (item.forward_by_dispatch && item.forward_to_uplokayukt) { return `${dispatch} → Hon’ble ${toUpLok}`; }

    if (item.forward_by_dispatch && item.sent_through_rk === 1 && item.forward_to_sec) { return `${dispatch} → Record Section (RC) → ${toSec}`; }
    if (item.forward_by_dispatch && item.forward_to_sec) { return `${dispatch} → ${toSec}`; }

    if (item.forward_by_dispatch && item.sent_through_rk === 1 && item.forward_to_ps) { return `${dispatch} → Record Section (RC) → ${toPs}`; }
    if (item.forward_by_dispatch && item.forward_to_ps) { return `${dispatch} → ${toPs}`; }

    if (item.forward_by_dispatch && item.sent_through_rk === 1 && item.forward_to_cio_io) { return `${dispatch} → Record Section (RC) → ${toCio}`; }
    if (item.forward_by_dispatch && item.forward_to_cio_io) { return `${dispatch} → ${toCio}`; }

    if (item.forward_by_dispatch && item.sent_through_rk === 1 && item.forward_to_io) { return `${dispatch} → Record Section (RC) → ${toio}`; }
    if (item.forward_by_dispatch && item.forward_to_io) { return `${dispatch} → ${toio}`; }

    if (item.forward_by_dispatch && item.sent_through_rk === 1 && item.forward_to_ro_aro) { return `${dispatch} → Record Section (RC) → ${toRoAro}`; }
    if (item.forward_by_dispatch && item.forward_to_ro_aro) { return `${dispatch} → ${toRoAro}`; }

    if (item.forward_by_dispatch && item.sent_through_rk === 1 && item.forward_to_ro) { return `${dispatch} → Record Section (RC) → ${toRo}`; }
    if (item.forward_by_dispatch && item.forward_to_ro) { return `${dispatch} → ${toRo}`; }

    if (item.forward_by_dispatch && item.sent_through_rk === 1 && item.forward_to_js) { return `${dispatch} → Record Section (RC) → ${toJs}`; }
    if (item.forward_by_dispatch && item.forward_to_js) { return `${dispatch} → ${toJs}`; }

    if (item.forward_by_dispatch && item.sent_through_rk === 1 && item.forward_to_us) { return `${dispatch} → Record Section (RC) → ${toUs}`; }
    if (item.forward_by_dispatch && item.forward_to_us) { return `${dispatch} → ${toUs}`; }

    if (item.forward_by_dispatch && item.sent_through_rk === 1 && item.forward_to_ds) { return `${dispatch} → Record Section (RC) → ${toDs}`; }
    if (item.forward_by_dispatch && item.forward_to_ds) { return `${dispatch} → ${toDs}`; }

    if (item.forward_by_dispatch && item.sent_through_rk === 1 && item.forward_to_dispatch) { return `${dispatch} → Record Section (RC) → ${toDispatch}`; }
    if (item.forward_by_dispatch && item.forward_to_dispatch) { return `${dispatch} → ${toDispatch}`; }

    if (item.forward_by_dispatch && item.sent_through_rk === 1 && item.forward_to_so) { return `${dispatch} → Record Section (RC) → ${toSo}`; }
    if (item.forward_by_dispatch && item.forward_to_so) { return `${dispatch} → ${toSo}`; }

    if (item.forward_by_dispatch && item.sent_through_rk === 1 && item.forward_to_pro) { return `${dispatch} → Record Section (RC) → ${toPro}`; }
    if (item.forward_by_dispatch && item.forward_to_pro) { return `${dispatch} → ${toPro}`; }

    if (item.forward_by_dispatch && item.sent_through_rk === 1 && item.forward_to_aps) { return `${dispatch} → Record Section (RC) → ${toAps}`; }
    if (item.forward_by_dispatch && item.forward_to_aps) { return `${dispatch} → ${toAps}`; }

    if (item.forward_by_dispatch && item.sent_through_rk === 1 && item.forward_to_st) { return `${dispatch} → Record Section (RC) → ${toSt}`; }
    if (item.forward_by_dispatch && item.forward_to_st) { return `${dispatch} → ${toSt}`; }

    if (item.forward_by_dispatch && item.sent_through_rk === 1 && item.forward_to_ac) { return `${dispatch} → Record Section (RC) → ${toAc}`; }
    if (item.forward_by_dispatch && item.forward_to_ac) { return `${dispatch} → ${toAc}`; }

    return `${record} → Record Section (RC)`;
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[18px] text-gray-700">Movement History</span>
      </div>

      <div className="relative pl-10">
        <div className="absolute left-[14px] top-[20px] bottom-[20px] w-[2px] bg-blue-300" />

        {finalItems.map((item, index) => (
          <div key={index} className="relative mb-4">
            <div className="absolute left-[-32px] top-2 w-4 h-4 bg-white rounded-full border border-gray-300 flex items-center justify-center">
              <div className="w-2 h-2 bg-blue-600 rounded-full" />
            </div>

            <div className="bg-white rounded-xl shadow border p-4 sm:p-5 flex flex-col sm:flex-row justify-between gap-3">
              <div className="flex-1">
                <p className="text-[15px] font-medium text-gray-900">
                  {getMovementTitle(item)}
                </p>
                <p className="text-[12px] text-gray-500 mt-1">
                  {item?.created_at || ""}
                </p>

                 {/* complaint?.status === "Final Disposal/Closed" &&
                 item?.status === "Final Decision" ? */}
                  {
                 complaint?.status === "Final Disposal/Closed" &&
                 item?.status === "Final Decision" ||
                  complaint?.status === "Pull Back" && item?.status == "Pull Back"  ||
                  complaint?.status === "Return" && item?.status == "Return" || 
                   complaint?.status === "Reject" && item?.status == "Reject"
                  ?   (
                   <p className="text-[13px] text-gray-600 mt-1">
                  <span className="font-semibold">Remark:</span>{" "}
                  <span className="kruti-input">{item?.remark || item?.remarks || "miyC/k ugha"}</span>
                </p>
                 )
                 :
                   <p className="text-[13px] text-gray-600 mt-1">
                  <span className="font-semibold">Target Date:</span>{" "}
                  <span className="">{item?.target_date || "उपलब्ध नहीं"}</span>
                </p>
                }
              </div>

               <div className="flex flex-col items-start sm:items-end gap-1.5 min-w-fit">
                <span className="text-[11px] sm:text-[12px] bg-blue-100 text-blue-600 px-2 py-1 rounded-md whitespace-nowrap">
                  {item?.status || "Forwarded"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovementHistory;