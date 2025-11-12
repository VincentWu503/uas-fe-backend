const addressModels = require('../models/address_model.js');
const { validationResult } = require('express-validator');

exports.getAddresses = async (req, res, next) => {
    console.log('req user incase of login', req.user)
    try{
        const addresses = await addressModels.findAll();
        if (!addresses){
            return res.status(500).send("Failed to find addresses!")
        } else{
            return res.status(200).json(addresses);
        }
    } catch (err){
        return next(err);
    }
}

exports.addAddress = async (req, res, next) => {
    try{
        const validationError = validationResult(req)
        if (!validationError.isEmpty()){
            return res.status(400).json(validationError);
        }

        const {
            alamat_lengkap,
            kelurahan,
            kabupaten_kota,
            provinsi
        } = req.body

        const address = await addressModels.addAddress(
            alamat_lengkap,
            kelurahan,
            kabupaten_kota,
            provinsi
        )

        if (address) return res.status(201).json({
            message: "Added address successfully", address
        })
    } catch (err){
        return next(err);
    }
}

exports.updateAddressById = async (req, res, next) => {
    try {
        const validationError = validationResult(req);
        if (!validationError.isEmpty()) {
            return res.status(400).json(validationError);
        }
        const addressId = req.params.id;

        const exists = await addressModels.findOne(addressId);
        if (!exists) {
            return res.status(404).send("Address item doesn't exists!");
        }

        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: "No update data provided." });
        }

        const {
            alamat_lengkap,
            kelurahan,
            kabupaten_kota,
            provinsi
        } = req.body;

        const updates = {};
        if (alamat_lengkap !== undefined) updates.alamat_lengkap = alamat_lengkap;
        if (kelurahan !== undefined) updates.kelurahan = kelurahan;
        if (kabupaten_kota !== undefined) updates.kabupaten_kota = kabupaten_kota;
        if (provinsi !== undefined) updates.provinsi = provinsi;

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: "No valid update fields provided." });
        }

        const updatedAddress = await addressModels.updateAddressById(addressId, updates);
        
        return res.status(200).json({
            message: "Address updated successfully.", 
            updatedAddress
        });

    } catch (err) {
        return next(err);
    }
}

exports.deleteAddressById = async (req, res, next) => {
    try{
        const addressId = req.params.id

        const exists = await addressModels.findOne(addressId);
        if (!exists){
            return res.status(404).send("Address item doesn't exists!")
        }

        const deletedAddress = await addressModels.deleteAddressById(addressId);
        if (deletedAddress) {
            return res.status(200).json({
                message: "Address deleted successfully.", 
                deletedAddress
            });
        } else {
            return res.status(500).send("Failed to delete address.");
        }
    } catch (err) {
        return next(err)
    }
}