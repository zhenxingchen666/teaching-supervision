<script setup lang="ts">
import { ref } from 'vue'
import FeedbackDialog from './FeedbackDialog.vue'
import NotificationPanel from './NotificationPanel.vue'
import { useNotifications } from '../composables/useNotifications'

const showFeedback = ref(false)
const { hasUnreadMessages } = useNotifications()

function openFeedback() {
  showFeedback.value = true
}
</script>

<template>
  <header class="header">
    <div class="header-aside-area">
      <img src="../assets/icons/svg_e5a73240.svg" alt="logo" class="logo-icon" />
    </div>
    <div class="header-main-area">
      <span class="system-title">教学巡视督导系统</span>
      <div class="header-right">
        <div class="icon-btn" data-tip="意见反馈" @click="openFeedback">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" version="1.1" width="20" height="20" viewBox="0 0 20 20"><path d="M0.60000002,6.6278238Q0.60000002,4.3037719,0.91608113,3.68342751Q1.34386151,2.84386149,2.18342745,2.4160811300000002Q2.8037716,2.10000002,5.1278238,2.10000002L14.872176,2.10000002Q17.196229000000002,2.10000002,17.816572,2.41608179Q18.656136,2.84385958,19.083918,3.6834276299999997Q19.4,4.3037721,19.4,6.6278238L19.4,13.372176Q19.4,15.696229,19.083918,16.316572999999998Q18.656136,17.15614,17.81657,17.58392Q17.196227999999998,17.9,14.872176,17.9L5.1278238,17.9Q2.8037723999999997,17.9,2.18342835,17.58392Q1.343863,17.156139,0.91608149,16.316572999999998Q0.60000002,15.696229,0.60000002,13.372176L0.60000002,6.6278238ZM2.39999998,6.6278238L2.39999998,13.372176Q2.39999998,15.264087,2.5198925,15.499388Q2.682155,15.817846,3.0006098000000003,15.980106Q3.2359141,16.099999,5.1278238,16.099999L14.872176,16.099999Q16.764085,16.099999,16.999389,15.980106Q17.317844,15.817846,17.480106,15.499388Q17.599998,15.264087,17.599998,13.372176L17.599998,6.6278238Q17.599998,4.735913,17.480106,4.5006105000000005Q17.317844,4.1821538,16.999388,4.0198922Q16.764087,3.89999998,14.872176,3.89999998L5.1278238,3.89999998Q3.2359136,3.89999998,3.0006106,4.0198927Q2.6821544,4.1821543000000005,2.5198929000000003,4.5006106Q2.39999998,4.7359135000000006,2.39999998,6.6278238Z" fill="#191C1E"/><path d="M12.364401,11.3379187375L19.019014,6.6405444775L17.980984,5.1700023975L11.3263712,9.8673765375Q10.4649801,10.4754171375,10.264699,10.5249719375Q10,10.5904660375,9.7353029,10.5249719375Q9.535018,10.4754157375,8.6736293,9.8673758375L2.01901484,5.1700023975L0.98098516,6.6405444775L7.6355982,11.3379173375Q8.7737856,12.141345537500001,9.302966600000001,12.2722802375Q9.9999981,12.4447465375,10.697032,12.2722802375Q11.2262115,12.141346437500001,12.364401,11.3379187375Z" fill-rule="evenodd" fill="#191C1E"/></svg>
        </div>
        <el-popover
          trigger="click"
          :width="400"
          :show-arrow="false"
          popper-class="notification-popover"
          placement="bottom-end"
          :offset="8"
          :teleported="false"
        >
          <template #reference>
            <div class="icon-btn" :class="{ 'has-dot': hasUnreadMessages }" data-tip="消息">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" version="1.1" width="20" height="20" viewBox="0 0 20 20"><defs><clipPath id="bell-clip"><rect x="-0.9" y="-0.9" width="21.8" height="21.8" rx="0"/></clipPath></defs><g clip-path="url(#bell-clip)"><path d="M3.2764704,10.6861134L1.5831663599999999,12.818425Q0.8415775,13.752275,1.36008325,14.826138Q1.87858802,15.9,3.0710762,15.9L16.928924000000002,15.9Q18.121412,15.9,18.639917,14.826137Q19.158421,13.752275,18.416832,12.818423L16.72353,10.6861153L16.72353,6.8235292Q16.72353,4.0385525,14.754253,2.0692760999999997Q12.784977,0.10000001999999997,10,0.10000043999999997Q7.2150226,0.10000032000000003,5.2457466,2.0692760999999997Q3.2764704,4.0385518000000005,3.2764704,6.8235292L3.2764704,10.6861134ZM4.8812701999999994,11.559693Q4.9760702000000006,11.440315,5.0262704,11.296377Q5.0764704,11.15244,5.0764704,11L5.0764704,6.8235292Q5.0764704,4.7841363,6.5185385,3.3420684Q7.9606071,1.90000027,10,1.90000039Q12.039392,1.89999998,13.481461,3.3420682Q14.92353,4.7841372,14.92353,6.8235292L14.92353,11Q14.92353,11.15244,14.973729,11.296377Q15.02393,11.440315,15.11873,11.559693L17.007235,13.937811Q17.046267,13.986961,17.018976,14.04348Q16.991685,14.099999,16.928924000000002,14.099999L3.0710762,14.099999Q3.0083134,14.099999,2.9810236000000003,14.04348Q2.9537348000000003,13.986962,2.9927645,13.937815L4.8812701999999994,11.559693Z" fill-rule="evenodd" fill="#191C1E"/><path d="M10.0000002,19.5830464Q11.8318648,19.5830464,13.1680174,18.10311955Q13.2274189,18.03732562,13.2728438,17.96120712Q13.3182688,17.88508862,13.347971000000001,17.80157074Q13.3776727,17.71805288,13.390510599999999,17.63034521Q13.403348399999999,17.542637512,13.398829,17.454110563Q13.394309,17.36558361,13.3726053,17.27963942Q13.3509016,17.19369525,13.3128481,17.11363661Q13.2747951,17.03357801,13.2218542,16.96248156Q13.1689138,16.89138508,13.1031199,16.83198297Q12.970243499999999,16.71201509,12.8015714,16.65202892Q12.6328993,16.5920428,12.4541106,16.60117072Q12.275322899999999,16.61029869,12.113637,16.68715113Q11.9519515,16.76400363,11.831983600000001,16.89688045Q11.031907799999999,17.78304657,10.0000002,17.78304657Q8.968092200000001,17.78304657,8.16801721,16.89688057Q8.10861504,16.83108664,8.03751862,16.77814573Q7.96642217,16.72520483,7.88636357,16.68715131Q7.80630496,16.6490978,7.72036077,16.62739414Q7.6344166,16.60569048,7.545889646,16.60117078Q7.457362697,16.59665108,7.36965501,16.6094889Q7.28194731,16.62232679,7.19842944,16.65202892Q7.11491156,16.68173099,7.03879309,16.72715586Q6.96267456,16.77258074,6.89688057,16.83198279Q6.83108664,16.89138496,6.77814573,16.96248138Q6.72520483,17.03357783,6.68715131,17.11363643Q6.6490978,17.19369504,6.62739414,17.27963923Q6.60569048,17.3655834,6.60117078,17.454110354Q6.59665108,17.542637303,6.6094889,17.63034499Q6.62232679,17.71805269,6.65202892,17.80157056Q6.68173099,17.88508844,6.72715586,17.96120691Q6.77258074,18.03732544,6.83198279,18.10311943Q8.16813523,19.5830464,10.0000002,19.5830464Z" fill-rule="evenodd" fill="#191C1E"/></g></svg>
              <svg v-if="hasUnreadMessages" class="red-dot" xmlns="http://www.w3.org/2000/svg" fill="none" version="1.1" width="10" height="10" viewBox="0 0 10 10"><ellipse cx="5" cy="5" rx="3" ry="3" fill="#E30000"/><ellipse cx="5" cy="5" rx="4" ry="4" fill-opacity="0" stroke="#F5F8FE" fill="none" stroke-width="2"/></svg>
            </div>
          </template>
          <NotificationPanel />
        </el-popover>
        <div class="divider"></div>
        <div class="user-info">
          <div class="avatar">
            <img src="/avatar.png" alt="avatar" />
          </div>
          <span class="username">admin</span>
        </div>
        <div class="role-selector">
          <span>管理员</span>
          <img src="../assets/icons/svg_005c4897.svg" alt="" class="arrow" />
        </div>
        <div class="icon-btn logout-btn" data-tip="退出登录">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M8.33333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V4.16667C2.5 3.72464 2.67559 3.30072 2.98816 2.98816C3.30072 2.67559 3.72464 2.5 4.16667 2.5H8.33333" stroke="#191C1E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.3333 14.1667L17.5 10L13.3333 5.83334" stroke="#191C1E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M17.5 10H7.5" stroke="#191C1E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
      </div>
    </div>
    <FeedbackDialog v-model:visible="showFeedback" />
  </header>
</template>

<style scoped>
.header {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0;
}

.header-aside-area {
  width: 220px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.logo-icon {
  width: 180px;
  height: 56px;
  object-fit: contain;
}

.header-main-area {
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  position: relative;
  padding: 0 20px;
}

.system-title {
  font-size: 20px;
  font-weight: 600;
  color: #022170;
  white-space: nowrap;
}

.header-right {
  position: absolute;
  top: 19px;
  right: 45px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.icon-btn {
  position: relative;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid rgba(105, 123, 169, 0.1);
}

.icon-btn:hover {
  background: #ffffff;
  border-color: rgba(25, 71, 255, 0.2);
  box-shadow: 0 2px 8px rgba(190, 198, 223, 0.4);
  transform: translateY(-1px);
}

.icon-btn:active {
  transform: translateY(0);
}

.icon-btn svg:first-child {
  width: 20px;
  height: 20px;
}

.icon-btn .red-dot {
  position: absolute;
  top: 9px;
  right: 9px;
  width: 10px;
  height: 10px;
}

.icon-btn::before,
.icon-btn::after {
  position: absolute;
  opacity: 0;
  pointer-events: none;
  transition: all 0.2s ease;
  transition-delay: 0s;
}

.icon-btn::before {
  content: attr(data-tip);
  top: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%) translateY(-4px);
  min-width: 72px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(34, 38, 51, 0.92);
  color: #ffffff;
  font-size: 13px;
  line-height: 18px;
  border-radius: 6px;
  white-space: nowrap;
  padding: 0 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
}

.icon-btn::after {
  content: '';
  top: calc(100% + 4px);
  left: 50%;
  transform: translateX(-50%) translateY(-4px);
  border: 5px solid transparent;
  border-bottom-color: rgba(34, 38, 51, 0.92);
}

.icon-btn:hover::before,
.icon-btn:hover::after {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
  transition-delay: 0.2s;
}

.divider {
  width: 1px;
  height: 24px;
  background: rgba(105, 123, 169, 0.3);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 12px 4px 4px;
  border-radius: 22px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.user-info:hover {
  background: rgba(255, 255, 255, 0.5);
}

.avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 6px rgba(25, 71, 255, 0.15);
  flex-shrink: 0;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.username {
  font-size: 14px;
  font-weight: 600;
  color: #191c1e;
  line-height: 20px;
}

.role-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 110px;
  height: 44px;
  padding: 0 10px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
  border: 1px solid rgba(105, 123, 169, 0.1);
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  flex-shrink: 0;
}

.role-selector:hover {
  background: rgba(255, 255, 255, 0.95);
  border-color: rgba(25, 71, 255, 0.2);
  box-shadow: 0 2px 8px rgba(190, 198, 223, 0.3);
}

.role-selector span {
  font-size: 14px;
  color: #191c1e;
  white-space: nowrap;
}

.role-selector .arrow {
  width: 16px;
  height: 16px;
}

.logout-btn {
  background: transparent;
  border: none;
  box-shadow: none;
  border-radius: 0;
}

.logout-btn:hover {
  background: transparent;
  border: none;
  box-shadow: none;
  transform: none;
}
</style>

<style>
.notification-popover.el-popover.el-popper {
  padding: 0;
  border: none;
  border-radius: 18px;
  box-shadow: 0 10px 30px rgba(190, 198, 223, 0.4);
  overflow: hidden;
}
</style>
