<?php

namespace App\Repositories;

use App\Models\User;
use App\Models\UserAddress;
use Illuminate\Database\Eloquent\Collection;

/**
 * Class UserRepository.
 */
class UserRepository
{
    /**
     * Method to get user data based on
     * @param int $id unique ID of the users
     * @return Collection
     */
    public function get(int $id)
    {
        return User::findOrFail($id);
    }

    /**
     * Method to get user data based on
     * @param string $email unique EMAIL of the users
     * @return Collection
     */
    public function getByEmail(String $email)
    {
        return User::where('email', $email)->first();
    }


    /**
     * Method to create user address data based on
     * @param array $data data of the users
     * @return UserAddress
     */
    public function create(array $data)
    {
        return UserAddress::create($data);
    }


    /**
     * Method to update user data based on
     * @param int $id unique ID of the users
     * @param array $data Values to update
     * @return Collection
     */
    public function update(Int $id, array $data)
    {
        $user = User::findOrFail($id);
        $user->update($data);
        return $user;
    }

    /**
     * Method to remove user data based on
     * @param int $id unique ID of the users
     * @return boolean | null  Success or fail
     */
    public function delete(Int $id)
    {
        $user = User::findOrFail($id);
        return $user->delete();
    }
}
