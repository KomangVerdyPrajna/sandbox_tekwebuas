<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Promotion;
use Illuminate\Support\Facades\Validator;

class PromotionController extends Controller
{
    private $allowedRoles = ['admin','super_admin'];

    /* ====================== 1. SHOW ALL (ADMIN ONLY) ====================== */
    public function index(Request $request)
    {
        if (!in_array($request->user()->role, $this->allowedRoles)) {
            return response()->json(['message'=>'Tidak punya akses.'],403);
        }

        return response()->json([
            'status'=>true,
            'promotions'=>Promotion::with('products:id,name,price,img_url')->get()
        ]);
    }

    /* ====================== 2. STORE PROMO ====================== */
    public function store(Request $request)
    {
        if (!in_array($request->user()->role,$this->allowedRoles)) {
            return response()->json(['message'=>'Tidak punya akses.'],403);
        }

        $validator = Validator::make($request->all(),[
            'name'=>'required|string|max:255|unique:promotions,name',
            'discount_type'=>'required|in:percentage,fixed',
            'discount_value'=>'required|numeric|min:0',
            'start_date'=>'required|date',
            'end_date'=>'required|date|after:start_date',
            'is_active'=>'boolean',
            'product_ids'=>'nullable|array',
            'product_ids.*'=>'exists:products,id'
        ]);

        if($validator->fails()) return response()->json($validator->errors(),422);

        $promotion = Promotion::create($request->except('product_ids'));

        if($request->product_ids) $promotion->products()->attach($request->product_ids);

        return response()->json([
            'message'=>'Promo berhasil dibuat',
            'promotion'=> $promotion->load('products')
        ]);
    }

    /* ====================== 3. SHOW DETAIL ====================== */
    public function show(Request $request, Promotion $promotion)
    {
        if(!in_array($request->user()->role,$this->allowedRoles)) 
            return response()->json(['message'=>'Tidak punya akses.'],403);

        return response()->json([
            'promotion'=>$promotion->load('products')
        ]);
    }

    /* ====================== 4. UPDATE ====================== */
    public function update(Request $request, Promotion $promotion)
    {
        if (!in_array($request->user()->role,$this->allowedRoles)) {
            return response()->json(['message'=>'Tidak punya akses.'],403);
        }

        $validator = Validator::make($request->all(),[
            'name'=>'required|string|max:255|unique:promotions,name,'.$promotion->id,
            'discount_type'=>'required|in:percentage,fixed',
            'discount_value'=>'required|numeric|min:0',
            'start_date'=>'required|date',
            'end_date'=>'required|date|after:start_date',
            'is_active'=>'boolean',
            'product_ids'=>'nullable|array',
            'product_ids.*'=>'exists:products,id'
        ]);

        if($validator->fails()) return response()->json($validator->errors(),422);

        $promotion->update($request->except('product_ids'));

        $request->product_ids ? 
            $promotion->products()->sync($request->product_ids) :
            $promotion->products()->sync([]);

        return response()->json(['message'=>'Promo diperbarui','promotion'=>$promotion->load('products')]);
    }

    /* ====================== 5. DELETE ====================== */
    public function destroy(Request $request, Promotion $promotion)
    {
        if (!in_array($request->user()->role,$this->allowedRoles)) {
            return response()->json(['message'=>'Tidak punya akses.'],403);
        }

        $promotion->delete();
        return response()->json(['message'=>'Promo berhasil dihapus']);
    }

    /* ====================== 6. PUBLIC MARKETPLACE ====================== */
    public function public()
    {
        $now = now();

        $promo = Promotion::with('products:id,name,price,img_url')
            ->where('is_active',true)
            ->where('start_date','<=',$now)
            ->where('end_date','>=',$now)
            ->get()
            ->map(function($p){
                return [
                    'id'=>$p->id,
                    'name'=>$p->name,
                    'type'=>$p->discount_type,
                    'value'=>$p->discount_value,
                    'products'=>$p->products->map(function($prod)use($p){
                        $disc = $p->discount_type == "percentage"
                            ? $prod->price - ($prod->price * $p->discount_value / 100)
                            : $prod->price - $p->discount_value;

                        return [
                            'id'=>$prod->id,
                            'name'=>$prod->name,
                            'price_before'=>$prod->price,
                            'price_after'=>max($disc,0),
                            'img_url'=>$prod->img_url
                        ];
                    })
                ];
        });

        return response()->json(['promotions'=>$promo]);
    }
}
