const usageRecordServices = require("../services/usageRecordServices");
const subscriptionServices = require("../services/subscriptionServices");
const userServices = require("../services/userServices");
const validators = require("../validation/usage/validate");
const constants = require("../constants/en");

const recordUsage = async (req, res) => {
  try {
    const { userId, action, usedUnits } = req.body;

    const validation = validators.recordUsage(req.body);
    if (!validation.status) {
      return res
        .status(constants.BAD_REQUEST_STATUS_CODE)
        .json({ success: false, message: validation.message });
    }

    const user = await userServices.getOne({ id: userId });
    if (!user) {
      return res
        .status(constants.NOT_FOUND_STATUS_CODE)
        .json({ success: false, message: constants.USER_NOT_FOUND });
    }

    const result = await usageRecordServices.create({
      userId,
      action,
      usedUnits,
    });

    return res.status(constants.SUCCESS_STATUS_CODE).json({
      success: true,
      message: constants.USAGE_RECORDED_SUCCESS,
      data: result,
    });
  } catch (error) {
    return res
      .status(constants.BAD_REQUEST_STATUS_CODE)
      .json({ success: false, message: error.message });
  }
};

const getCurrentUsage = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userServices.getOne({ id });
    if (!user) {
      return res
        .status(constants.NOT_FOUND_STATUS_CODE)
        .json({ success: false, message: constants.USER_NOT_FOUND });
    }

    const subscription = await subscriptionServices.getActiveSubscriptionByUserId(id);
    if (!subscription) {
      return res
        .status(constants.NOT_FOUND_STATUS_CODE)
        .json({ success: false, message: constants.NO_ACTIVE_SUBSCRIPTION });
    }

    const totalUsed = await usageRecordServices.getTotalUsageForCurrentMonth(id);
    const monthlyQuota = subscription.plan.monthlyQuota;
    const remainingUnits = monthlyQuota - totalUsed;

    return res.status(constants.SUCCESS_STATUS_CODE).json({
      success: true,
      message: constants.CURRENT_USAGE_FETCHED,
      data: {
        totalUsed,
        remainingUnits: remainingUnits > 0 ? remainingUnits : 0,
        plan: {
          id: subscription.plan.id,
          name: subscription.plan.name,
          monthlyQuota: subscription.plan.monthlyQuota,
          extraChargePerUnit: subscription.plan.extraChargePerUnit,
        },
      },
    });
  } catch (error) {
    return res
      .status(constants.BAD_REQUEST_STATUS_CODE)
      .json({ success: false, message: error.message });
  }
};

const getBillingSummary = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userServices.getOne({ id });
    if (!user) {
      return res
        .status(constants.NOT_FOUND_STATUS_CODE)
        .json({ success: false, message: constants.USER_NOT_FOUND });
    }

    const subscription = await subscriptionServices.getActiveSubscriptionByUserId(id);
    if (!subscription) {
      return res
        .status(constants.NOT_FOUND_STATUS_CODE)
        .json({ success: false, message: constants.NO_ACTIVE_SUBSCRIPTION });
    }

    const totalUsage = await usageRecordServices.getTotalUsageForCurrentMonth(id);
    const monthlyQuota = subscription.plan.monthlyQuota;
    const extraChargePerUnit = subscription.plan.extraChargePerUnit;

    let extraUnits = 0;
    let extraCharges = 0;

    if (totalUsage > monthlyQuota) {
      extraUnits = totalUsage - monthlyQuota;
      extraCharges = extraUnits * extraChargePerUnit;
    }

    return res.status(constants.SUCCESS_STATUS_CODE).json({
      success: true,
      message: constants.BILLING_SUMMARY_FETCHED,
      data: {
        totalUsage,
        planQuota: monthlyQuota,
        extraUnits,
        extraCharges: parseFloat(extraCharges.toFixed(2)),
        plan: {
          id: subscription.plan.id,
          name: subscription.plan.name,
          monthlyQuota: subscription.plan.monthlyQuota,
          extraChargePerUnit: subscription.plan.extraChargePerUnit,
        },
      },
    });
  } catch (error) {
    return res
      .status(constants.BAD_REQUEST_STATUS_CODE)
      .json({ success: false, message: error.message });
  }
};

module.exports = {
  recordUsage,
  getCurrentUsage,
  getBillingSummary,
};
